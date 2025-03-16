import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { zodToJsonSchema } from "zod-to-json-schema";
import { auditLogQuerySchema, auditLogResponseSchema, paginatedResponseSchema } from '../schemas/auditLog.schema.js';
import AuditLogController from '../controllers/auditLog.controller.js';

export const auditLogRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new AuditLogController(fastify);

  // 获取审计日志列表
  fastify.get('/', {
    schema: {
      description: '获取审计日志列表',
      tags: ['审计日志'],
      querystring: zodToJsonSchema(auditLogQuerySchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(paginatedResponseSchema)
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getAuditLogs.bind(controller),
  });

  // 获取审计日志详情
  fastify.get('/:id', {
    schema: {
      description: '获取审计日志详情',
      tags: ['审计日志'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(auditLogResponseSchema)
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getAuditLogDetail.bind(controller),
  });

  // 获取操作类型统计
  fastify.get('/stats/operation-types', {
    schema: {
      description: '获取操作类型统计',
      tags: ['审计日志'],
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        operationType: { type: 'string' },
                        count: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getOperationTypeStats.bind(controller),
  });

  // 获取近期操作记录统计
  fastify.get('/stats/recent-activity', {
    schema: {
      description: '获取近期操作记录统计',
      tags: ['审计日志'],
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'string', default: '7' }
        }
      },
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        date: { type: 'string', format: 'date' },
                        count: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getRecentActivityStats.bind(controller),
  });
};

