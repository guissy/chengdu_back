import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  partAddSchema,
  partDeleteSchema,
  partDetailSchema,
  partGenericResponseSchema,
  partListResponseSchema,
  partListSchema,
  partResponseSchema,
  partUpdateSchema
} from '../schemas/part.schema.js';
import { PartController } from '../controllers/part.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const partRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new PartController(fastify);

  // 获取物业小区列表
  fastify.post('/list', {
    schema: {
      description: '获取物业小区列表',
      tags: ['物业小区'],
      body: zodToJsonSchema(partListSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(partListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getPartList.bind(controller),
  });

  // 获取物业小区详情
  fastify.get('/:id', {
    schema: {
      description: '获取物业小区详情',
      tags: ['物业小区'],
      params: zodToJsonSchema(partDetailSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(partResponseSchema)
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getPartDetail.bind(controller),
  });

  // 新增分区
  fastify.post('/add', {
    schema: {
      description: '新增分区',
      tags: ['物业小区'],
      body: zodToJsonSchema(partAddSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(partGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.addPart.bind(controller),
  });

  // 编辑分区
  fastify.post('/update', {
    schema: {
      description: '编辑分区',
      tags: ['物业小区'],
      body: zodToJsonSchema(partUpdateSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(partGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.updatePart.bind(controller),
  });

  // 删除分区
  fastify.post('/delete', {
    schema: {
      description: '删除分区',
      tags: ['物业小区'],
      body: zodToJsonSchema(partDeleteSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(partGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.deletePart.bind(controller),
  });
};
