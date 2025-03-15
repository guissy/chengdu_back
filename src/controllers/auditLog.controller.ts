import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { auditLogQuerySchema } from '../schemas/auditLog.schema.js';
import { AuditLogWhereInput } from '@prisma/client';

// 审计日志控制器
class AuditLogController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取审计日志列表
   */
  async getAuditLogs(
    request: FastifyRequest<{ Querystring: z.infer<typeof auditLogQuerySchema> }>,
    reply: FastifyReply
  ) {
    try {
      const {
        page,
        pageSize,
        operationType,
        targetType,
        operatorId,
        startDate,
        endDate,
        keyword
      } = request.query;

      // 构建查询条件
      const where = {} as AuditLogWhereInput

      if (operationType) {
        where.operationType = operationType;
      }

      if (targetType) {
        where.targetType = targetType;
      }

      if (operatorId) {
        where.operatorId = operatorId;
      }

      if (startDate || endDate) {
        where.operationTime = {};
        if (startDate) {
          where.operationTime.gte = new Date(startDate);
        }
        if (endDate) {
          // 设置为当天的最后一毫秒
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          where.operationTime.lte = endDateTime;
        }
      }

      if (keyword) {
        where.OR = [
          { targetName: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
          { operatorName: { contains: keyword, mode: 'insensitive' } },
        ];
      }

      // 查询总记录数
      const total = await this.fastify.prisma.auditLog.count({ where });

      // 查询分页数据
      const items = await this.fastify.prisma.auditLog.findMany({
        where,
        orderBy: { operationTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      // 计算总页数
      const totalPages = Math.ceil(total / pageSize);

      // 格式化响应数据
      const formattedItems = items.map(item => ({
        ...item,
        operationTime: item.operationTime.toISOString(),
      }));

      return reply.send({
        code: 200,
        data: {
          items: formattedItems,
          total,
          page,
          pageSize,
          totalPages,
        },
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取审计日志失败',
      });
    }
  }

  /**
   * 获取审计日志详情
   */
  async getAuditLogDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      const auditLog = await this.fastify.prisma.auditLog.findUnique({
        where: { id },
      });

      if (!auditLog) {
        return reply.status(404).send({
          code: 404,
          data: null,
          error: '审计日志不存在',
        });
      }

      // 格式化日志数据
      const formattedLog = {
        ...auditLog,
        operationTime: auditLog.operationTime.toISOString(),
      };

      return reply.send({
        code: 200,
        data: formattedLog,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取审计日志详情失败',
      });
    }
  }

  /**
   * 获取操作类型统计
   */
  async getOperationTypeStats(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const stats = await this.fastify.prisma.$queryRaw`
        SELECT "operationType", COUNT(*) as count
        FROM audit_logs
        GROUP BY "operationType"
        ORDER BY count DESC
      `;

      return reply.send({
        code: 200,
        data: stats,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取操作类型统计失败',
      });
    }
  }

  /**
   * 获取近期操作记录统计
   */
  async getRecentActivityStats(
    request: FastifyRequest<{ Querystring: { days: string } }>,
    reply: FastifyReply
  ) {
    try {
      const days = parseInt(request.query.days || '7');

      // 计算开始日期
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      // 查询每日操作记录数
      const stats = await this.fastify.prisma.$queryRaw`
        SELECT 
          DATE("operationTime") as date,
          COUNT(*) as count
        FROM audit_logs
        WHERE "operationTime" >= ${startDate}
        GROUP BY DATE("operationTime")
        ORDER BY date ASC
      `;

      return reply.send({
        code: 200,
        data: stats,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取近期操作记录统计失败',
      });
    }
  }
}

export default AuditLogController;
