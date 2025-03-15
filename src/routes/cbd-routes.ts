import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  cbdListSchema,
  cbdListResponseSchema,
} from '../schemas/cbd.schema.js';
import { CbdController } from '../controllers/cbd.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const cbdRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new CbdController(fastify);

  // 获取商圈列表
  fastify.post('/list', {
    schema: {
      description: '获取商圈列表',
      tags: ['商圈'],
      body: zodToJsonSchema(cbdListSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(cbdListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getCbdList.bind(controller),
  });
};
