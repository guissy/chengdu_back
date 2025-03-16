import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

// 声明在FastifyInstance上扩展prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// 创建Prisma实例
const prismaClient = new PrismaClient();

export const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // 添加Prisma到Fastify实例
  fastify.decorate('prisma', prismaClient);

  // 连接Prisma
  await prismaClient.$connect();

  // 当服务器关闭时断开Prisma连接
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});
