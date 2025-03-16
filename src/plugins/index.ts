import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from '../config/env.js';
import { registerSwagger } from './swagger.js';
import { prismaPlugin } from './prisma.js';
import { auditLogPlugin } from './auditLog.js';

export async function configurePlugins(app: FastifyInstance): Promise<void> {
  // 注册Prisma
  await app.register(prismaPlugin);

  // 配置CORS
  await app.register(fastifyCors, {
    origin: true, // 所有源都允许访问API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // 配置安全头
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  });

  // 配置速率限制
  await app.register(fastifyRateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_TIME_WINDOW,
  });

  // 注册Swagger
  await registerSwagger(app);

  await app.register(auditLogPlugin);
}
