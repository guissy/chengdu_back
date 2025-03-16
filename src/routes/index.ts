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
  fastify.register(cityRoutes, { prefix: '/api/city' });
  fastify.register(districtRoutes, { prefix: '/api/district' });
  fastify.register(cbdRoutes, { prefix: '/api/cbd' });
  fastify.register(partRoutes, { prefix: '/api/part' });
  fastify.register(positionRoutes, { prefix: '/api/position' });
  fastify.register(shopRoutes, { prefix: '/api/shop' });
  fastify.register(spaceRoutes, { prefix: '/api/space' });
  fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
  fastify.register(auditLogRoutes, { prefix: '/api/auditLog' });

  // 健康检查路由
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
};
