import { FastifySwaggerOptions, JSONObject } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';


export const swaggerOptions: FastifySwaggerOptions = {
// @ts-ignore
  openapi: {
    info: {
      title: '业务系统',
      description: '业务系统API文档',
      version: '1.0.0',
    },
    tags: [
      { name: '物业小区', description: '物业小区相关API' },
      { name: '铺位', description: '铺位相关API' },
      { name: '行政区划', description: '行政区划相关API' },
      { name: '商圈', description: '商圈相关API' },
      { name: '商家', description: '商家相关API' },
      { name: '广告位', description: '广告位相关API' },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
      },
    },
  },
  refResolver: {
    buildLocalReference(_json: JSONObject | string) {
      const json = typeof _json === "string" ? JSON.parse(_json) : _json;
      if (!json.title && json.$id) {
        json.title = json.$id;
      }
      return json.$id;
    },
  },
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};
