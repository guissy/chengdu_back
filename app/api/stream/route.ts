import { ResponseFactory } from '@/lib/api/response_stream';
import { MyProtoMessage } from '@/app/stream/protoUtils';
import { emitter, emitterSalt, emitterSalt2 } from '@/lib/emitter';
import { AuditLog } from '@/api-proto/chengdu';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * 异步生成器：流式发送数据时带上有趣的文本和 emoji✨
 */
async function* generateData() {
  while (true) {
    const newData = await Promise.race([
      new Promise<AuditLog>(resolve =>
        emitter.once('newAuditLog', resolve)
      ),
      delay(5000).then(() => null) // 5秒后超时
    ]);
    if (newData) {
      newData.id = emitterSalt + ' ' + emitterSalt2;
      yield newData;
    }
  }
}

export async function GET() {
  return ResponseFactory.streamSuccess(generateData, AuditLog);
}
