import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { cityRoutes } from './city-routes.js';
import { districtRoutes } from './district-routes.js';
import { cbdRoutes } from './cbd-routes.js';
import { partRoutes } from './part-routes.js';
import { positionRoutes } from './position-routes.js';
import { shopRoutes } from './shop-routes.js';
import { spaceRoutes } from './space-routes.js';
import { dashboardRoutes } from './dashboard-routes.js';
import { auditLogRoutes } from './auditLog-routes.js';

export const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // 注册所有路由
  fastify.register(cityRoutes, { prefix: '/city' });
  fastify.register(districtRoutes, { prefix: '/district' });
  fastify.register(cbdRoutes, { prefix: '/cbd' });
  fastify.register(partRoutes, { prefix: '/part' });
  fastify.register(positionRoutes, { prefix: '/position' });
  fastify.register(shopRoutes, { prefix: '/shop' });
  fastify.register(spaceRoutes, { prefix: '/space' });
  fastify.register(dashboardRoutes, { prefix: '/dashboard' });
  fastify.register(auditLogRoutes, { prefix: '/auditLog' });

  // 健康检查路由
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
};
