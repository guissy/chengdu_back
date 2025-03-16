import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  spaceAddSchema,
  spaceDeleteSchema,
  spaceDetailSchema,
  spaceGenericResponseSchema,
  spaceListResponseSchema,
  spaceListSchema,
  spaceResponseSchema,
  spaceUpdateSchema,
  spaceUpdateStateSchema,
} from '../schemas/space.schema.js';
import { SpaceController } from '../controllers/space.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const spaceRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new SpaceController(fastify);

  // 获取广告位列表
  fastify.post('/list', {
    schema: {
      description: '获取广告位列表',
      tags: ['广告位'],
      body: zodToJsonSchema(spaceListSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(spaceListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getSpaceList.bind(controller),
  });

  // 获取广告位详情
  fastify.get('/:id', {
    schema: {
      description: '获取广告位详情',
      tags: ['广告位'],
      params: zodToJsonSchema(spaceDetailSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(spaceResponseSchema)
                }
              }
            }
          }
        }
      }
    },
    handler: controller.getSpaceDetail.bind(controller),
  });

  // 新建广告位
  fastify.post('/add', {
    schema: {
      description: '新建广告位',
      tags: ['广告位'],
      body: zodToJsonSchema(spaceAddSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(spaceGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.addSpace.bind(controller),
  });

  // 编辑广告位
  fastify.post('/update', {
    schema: {
      description: '编辑广告位',
      tags: ['广告位'],
      body: zodToJsonSchema(spaceUpdateSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(spaceGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.updateSpace.bind(controller),
  });

  // 删除广告位
  fastify.post('/delete', {
    schema: {
      description: '删除广告位',
      tags: ['广告位'],
      body: zodToJsonSchema(spaceDeleteSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(spaceGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.deleteSpace.bind(controller),
  });

  // 启用/禁用广告位
  fastify.post('/updateState', {
    schema: {
      description: '启用/禁用广告位',
      tags: ['广告位'],
      body: zodToJsonSchema(spaceUpdateStateSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: zodToJsonSchema(spaceGenericResponseSchema),
            },
          },
        },
      },
    },
    handler: controller.updateSpaceState.bind(controller),
  });
};
