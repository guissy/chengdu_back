import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  shopAddSchema,
  shopUpdateSchema,
  shopDeleteSchema,
  shopListResponseSchema,
  shopCreateResponseSchema,
  shopGenericResponseSchema, shopResponseSchema, shopDetailSchema,
} from '../schemas/shop.schema.js';
import { ShopController } from '../controllers/shop.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const shopRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new ShopController(fastify);
  // 商家列表
  fastify.get('/list', {
    schema: {
      description: '商家列表',
      tags: ['商家'],
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(shopListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getShopList.bind(controller),
  });

  // 获取未关联商家列表
  fastify.get('/listUnbind', {
    schema: {
      description: '获取未关联商家列表',
      tags: ['商家'],
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(shopListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getUnbindShopList.bind(controller),
  });

  // 商家详情
  fastify.get('/:id', {
    schema: {
      description: '商家详情',
      tags: ['商家'],
      params: zodToJsonSchema(shopDetailSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(shopResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getShopDetail.bind(controller),
  });

  // 新建商家
  fastify.post('/add', {
    schema: {
      description: '新建商家',
      tags: ['商家'],
      body: zodToJsonSchema(shopAddSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(shopCreateResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.addShop.bind(controller),
  });

  // 编辑商家
  fastify.post('/update', {
    schema: {
      description: '编辑商家',
      tags: ['商家'],
      body: zodToJsonSchema(shopUpdateSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(shopGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.updateShop.bind(controller),
  });

  // 删除商家
  fastify.post('/delete', {
    schema: {
      description: '删除商家',
      tags: ['商家'],
      body: zodToJsonSchema(shopDeleteSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(shopGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.deleteShop.bind(controller),
  });
};
