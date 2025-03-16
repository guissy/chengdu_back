import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { zodToJsonSchema } from "zod-to-json-schema";
import DashboardController from '../controllers/dashboard.controller.js';
import { dashboardStatsSchema } from '../schemas/dashboard.schema.js';

export const dashboardRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new DashboardController(fastify);

  // 获取仪表盘统计数据
  fastify.get('/', {
    schema: {
      description: '获取仪表盘统计数据',
      tags: ['仪表盘'],
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(dashboardStatsSchema)
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getDashboardStats.bind(controller),
  });

  // 获取最近添加的商家
  fastify.get('/recent-shops', {
    schema: {
      description: '获取最近添加的商家',
      tags: ['仪表盘'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'string', default: '5' }
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
                        id: { type: 'string' },
                        shop_no: { type: 'string' },
                        trademark: { type: 'string' },
                        branch: { type: 'string', nullable: true },
                        type: { type: 'string' },
                        type_tag: { type: 'string', nullable: true },
                        business_type: { type: 'string' },
                        verify_status: { type: 'boolean' },
                        cbd: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        part: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
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
    handler: controller.getRecentShops.bind(controller),
  });

  // 获取商圈分布统计
  fastify.get('/cbd-distribution', {
    schema: {
      description: '获取商圈分布统计',
      tags: ['仪表盘'],
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
                        id: { type: 'string' },
                        name: { type: 'string' },
                        district: { type: 'string' },
                        shopCount: { type: 'number' },
                        partCount: { type: 'number' }
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
    handler: controller.getCbdDistribution.bind(controller),
  });

  // 获取商家类型分布
  fastify.get('/shop-type-distribution', {
    schema: {
      description: '获取商家类型分布',
      tags: ['仪表盘'],
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
                        type: { type: 'string' },
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
    handler: controller.getShopTypeDistribution.bind(controller),
  });
};
