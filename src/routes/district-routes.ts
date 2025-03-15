import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { districtListResponseSchema, districtListSchema, } from '../schemas/district.schema.js';
import { DistrictController } from '../controllers/district.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const districtRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new DistrictController(fastify);

  // 获取区域列表
  fastify.post('/list', {
    schema: {
      description: '获取区域列表',
      tags: ['行政区划'],
      body: zodToJsonSchema(districtListSchema),
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(districtListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getDistrictList.bind(controller),
  });
};
