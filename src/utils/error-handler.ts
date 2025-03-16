import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { formatZodError } from './response-formatter.js';

export function errorHandler(
  error: FastifyError | Error | ZodError | PrismaClientKnownRequestError | PrismaClientValidationError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);
  // ZodError 处理 (验证错误)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: 400,
      data: null,
      error: formatZodError(error),
    });
  }

  // Prisma 错误处理
  if (error instanceof PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (error.code === 'P2002') {
      return reply.status(409).send({
        code: 409,
        data: null,
        error: '数据已存在，无法创建重复记录',
      });
    }

    // P2025: Record not found
    if (error.code === 'P2025') {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '请求的资源不存在',
      });
    }
  }

  if (error instanceof PrismaClientValidationError) {
    return reply.status(400).send({
      code: 400,
      data: null,
      error: '数据验证错误',
    });
  }

  // Fastify 验证错误
  // @ts-ignore
  if (error.validation) {
    return reply.status(400).send({
      code: 400,
      data: null,
      error: error.message,
    });
  }

  // 自定义错误状态码
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply.status(error.statusCode).send({
      code: error.statusCode,
      data: null,
      error: error.message,
    });
  }

  // 默认500错误
  request.log.error(error);

  return reply.status(500).send({
    code: 500,
    data: null,
    error: '服务器内部错误',
  });
}
