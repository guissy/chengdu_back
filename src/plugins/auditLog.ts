import { AuditLogService } from "../controllers/auditLog.service.js";
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// 创建Fastify插件
export const auditLogPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // 注册审计日志服务
  const auditLogService = new AuditLogService(fastify);
  fastify.decorate('auditLog', auditLogService);

  // // 增加类型声明扩展
  // fastify.addHook('onRequest', async (request, reply) => {
  //   // 可以在这里添加请求前的钩子，比如从请求中提取用户信息等
  // });
});

// 扩展FastifyInstance类型
declare module 'fastify' {
  interface FastifyInstance {
    auditLog: AuditLogService;
  }
}
