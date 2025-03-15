import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { configurePlugins } from './plugins/index.js';
import { routes } from './routes/index.js';
import { errorHandler } from './utils/error-handler.js';

export async function buildApp(options: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    ...options,
  });

  // 注册全局错误处理
  app.setErrorHandler(errorHandler);

  // 配置插件
  await configurePlugins(app);

  // 注册根路由
  app.get('/', async () => {
    return { message: 'Hello, Vercel!' };
  });

  // 注册路由
  // routes()
  await app.register(routes);
  console.log("ο▬▬▬▬▬▬▬▬◙▅▅▆▆▇▇◤")
  return app;
}
