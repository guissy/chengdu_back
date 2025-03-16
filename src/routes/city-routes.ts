import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { cityListResponseSchema } from '../schemas/city.schema.js';
import { CityController } from '../controllers/city.controller.js';
import { zodToJsonSchema } from "zod-to-json-schema";

export const cityRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const controller = new CityController(fastify);

  // 获取城市列表
  fastify.get('/cityList', {
    schema: {
      description: '获取城市列表',
      tags: ['行政区划'],
      response: {
        200: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'number' },
                  data: zodToJsonSchema(cityListResponseSchema),
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getCityList.bind(controller),
  });
};
