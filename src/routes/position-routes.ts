import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  positionListSchema,
  positionAddSchema,
  positionUpdateSchema,
  positionDeleteSchema,
  positionSetEmptySchema,
  positionBindShopSchema,
  positionMarkSchema,
  positionListResponseSchema,
  positionGenericResponseSchema, positionDetailSchema, positionResponseSchema,
} from '../schemas/position.schema.js';
import { PositionController } from '../controllers/position.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const positionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new PositionController(fastify);

  // 获取铺位列表
  fastify.post('/list', {
    schema: {
      description: '获取铺位列表',
      tags: ['铺位'],
      body: zodToJsonSchema(positionListSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(positionListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getPositionList.bind(controller),
  });

  // 获取铺位详情
  fastify.get('/:id', {
    schema: {
      description: '获取铺位详情',
      tags: ['铺位'],
      params: zodToJsonSchema(positionDetailSchema),
      response: {
        201: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(positionResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getPositionDetail.bind(controller),
  });

  // 新增铺位
  fastify.post('/add', {
    schema: {
      description: '新增铺位',
      tags: ['铺位'],
      body: zodToJsonSchema(positionAddSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.addPosition.bind(controller),
  });

  // 编辑铺位
  fastify.post('/update', {
    schema: {
      description: '编辑铺位',
      tags: ['铺位'],
      body: zodToJsonSchema(positionUpdateSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.updatePosition.bind(controller),
  });

  // 删除铺位
  fastify.post('/delete', {
    schema: {
      description: '删除铺位',
      tags: ['铺位'],
      body: zodToJsonSchema(positionDeleteSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.deletePosition.bind(controller),
  });

  // 置为空铺
  fastify.post('/set', {
    schema: {
      description: '置为空铺',
      tags: ['铺位'],
      body: zodToJsonSchema(positionSetEmptySchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.setEmptyPosition.bind(controller),
  });

  // 关联新商家
  fastify.post('/bindShop', {
    schema: {
      description: '关联新商家',
      tags: ['铺位'],
      body: zodToJsonSchema(positionBindShopSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.bindShop.bind(controller),
  });

  // 快速标记铺位
  fastify.post('/mark', {
    schema: {
      description: '快速标记铺位',
      tags: ['铺位'],
      body: zodToJsonSchema(positionMarkSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(positionGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.markPosition.bind(controller),
  });
};
