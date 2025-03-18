import { NextResponse } from 'next/server';
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { ErrorProto, ProtoMessage, ResponseBody, SuccessProto } from '@/lib/api/response_pb';

export class ResponseFactory {
  /**
   * 拼接 varint 长度前缀与消息体
   */
  private static encodeMessage(buffer: Uint8Array): Uint8Array {
    const lengthPrefix = new BinaryWriter().uint32(buffer.length).finish();
    return concatUint8Arrays(lengthPrefix, buffer);
  }

  /**
   * 构建一个流式成功响应
   * @param dataProducer 数据生成器或生成器函数
   * @param codec 数据的编解码器（可选）
   * @param code 响应状态码，默认为200
   */
  static streamSuccess<T>(
    dataProducer: AsyncGenerator<T> | (() => AsyncGenerator<T>),
    codec?: ProtoMessage<T>,
    code = 200
  ): NextResponse {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const producer = typeof dataProducer === 'function' ? dataProducer() : dataProducer;
          for await (const data of producer) {
            // 根据是否提供 codec 选择不同编码方式
            const payload = codec
              ? codec.encode(data).finish()
              : new TextEncoder().encode(JSON.stringify(data));

            const successData = { code, payload };
            const messageBuffer = SuccessProto.encode(successData).finish();
            const fullMessage = ResponseFactory.encodeMessage(messageBuffer);
            console.log("Enqueued fullMessage:", fullMessage, "length:", fullMessage.length);
            controller.enqueue(fullMessage);
          }
          console.log("Stream complete, closing controller");
          controller.close();
        } catch (error) {
          // 统一错误处理：封装错误消息并发送给客户端
          const errorData = ErrorProto.encode({
            code: 500,
            message: `Stream encoding failed: ${(error as Error).message}`,
          }).finish();
          const fullMessage = ResponseFactory.encodeMessage(errorData);
          controller.enqueue(fullMessage);
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/x-protobuf-stream",
      },
    });
  }

  /**
   * 构建错误响应
   * @param message 错误信息
   * @param code 状态码，默认500
   * @param details 附加详情（可选）
   */
  static error(message: string, code = 500, details?: unknown): NextResponse {
    const errorData = {
      code,
      message,
      details: details ? new TextEncoder().encode(JSON.stringify(details)) : undefined,
    };
    const buffer = ErrorProto.encode(errorData).finish();
    return new NextResponse(buffer, {
      status: code,
      headers: {
        "Content-Type": "application/x-protobuf",
      },
    });
  }

  /**
   * 解码接收的流数据
   * @param stream 接收到的流数据
   * @param payloadCodec 成功消息中数据的编解码器（可选）
   */
  static async* decodeStream<T>(
    stream: ReadableStream<Uint8Array>,
    payloadCodec?: ProtoMessage<T>
  ): AsyncGenerator<ResponseBody<T>> {
    const reader = stream.getReader();
    let buffer = new Uint8Array(0);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.length > 0) {
            console.warn("Residual data not processed:", buffer);
          }
          break;
        }
        // 拼接新接收的数据
        buffer = concatUint8Arrays(buffer, value) as Uint8Array<ArrayBuffer>;
        console.log('[NETWORK] Received chunk, buffer size:', buffer.length);

        // 循环处理缓冲区中完整的消息
        while (true) {
          const bufferReader = new BinaryReader(buffer);
          let messageLength: number;
          try {
            // 读取 varint 编码的消息长度
            messageLength = bufferReader.uint32();
          } catch (e) {
            // 数据不足，无法完整读取消息长度
            break;
          }

          const headerLength = bufferReader.pos;
          const totalMessageLength = headerLength + messageLength;

          if (buffer.length < totalMessageLength) break;

          // 提取单条消息体并更新缓冲区
          const messageBody = buffer.slice(headerLength, totalMessageLength);
          buffer = buffer.slice(totalMessageLength);

          // 优先尝试解析为错误消息
          try {
            const error = ErrorProto.decode(new BinaryReader(messageBody));
            if (error.code >= 400) {
              console.log('[PROTOCOL] Received error:', error);
              yield { status: "error", error };
              continue;
            }
          } catch (e) {
            // 非错误消息，继续尝试解析成功消息
          }
          try {
            const success = SuccessProto.decode(new BinaryReader(messageBody));
            console.log('[PROTOCOL] Received success, payload length:', success.payload?.length);
            let data: T;
            if (payloadCodec) {
              data = payloadCodec.decode(success.payload!);
            } else {
              data = JSON.parse(new TextDecoder().decode(success.payload!)) as T;
            }
            yield { status: "success", data };
          } catch (decodeError) {
            console.error('[DECODE ERROR]', decodeError);
            yield {
              status: "error",
              error: {
                code: 500,
                message: `Decoding failed: ${decodeError instanceof Error ? decodeError.message : "Unknown format"}`
              }
            };
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

/**
 * 辅助函数：拼接两个 Uint8Array
 * @param a 第一个数组
 * @param b 第二个数组
 */
function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}
