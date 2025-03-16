import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ShopType } from '@prisma/client';

// Dashboard Statistics Schema
export default class DashboardController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取仪表盘统计数据
   */
  async getDashboardStats(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // 获取商圈总数
      const cbdCount = await this.fastify.prisma.cBD.count();

      // 获取物业小区总数
      const partCount = await this.fastify.prisma.part.count();

      // 获取铺位总数
      const positionCount = await this.fastify.prisma.position.count();

      // 获取商家总数
      const shopCount = await this.fastify.prisma.shop.count();

      // 获取广告位总数
      const spaceCount = await this.fastify.prisma.space.count();

      // 获取广告活动总数（假设有一个 Campaign 模型）
      // 如果没有 Campaign 模型，可以替换成其他相关统计
      const campaignCount = 42; // 替换为实际的查询

      // 组装响应数据
      const dashboardStats = {
        cbdCount,
        partCount,
        positionCount,
        shopCount,
        spaceCount,
        campaignCount,
      };

      return reply.send({
        code: 200,
        data: dashboardStats,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取仪表盘数据失败',
      });
    }
  }

  /**
   * 获取最近添加的商家列表
   */
  async getRecentShops(
    request: FastifyRequest<{ Querystring: { limit: string } }>,
    reply: FastifyReply
  ) {
    try {
      const limit = parseInt(request.query.limit) || 5;

      const recentShops = await this.fastify.prisma.shop.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          cbd: true,
          part: true,
        },
      });

      const formattedShops = recentShops.map(shop => ({
        id: shop.id,
        shop_no: shop.shop_no,
        trademark: shop.trademark,
        branch: shop.branch,
        type: shop.type,
        type_tag: shop.type_tag,
        business_type: shop.business_type,
        verify_status: shop.verified,
        cbd: {
          id: shop.cbd.id,
          name: shop.cbd.name,
        },
        part: {
          id: shop.part.id,
          name: shop.part.name,
        },
        createdAt: shop.createdAt,
      }));

      return reply.send({
        code: 200,
        data: formattedShops,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取最近添加的商家失败',
      });
    }
  }

  /**
   * 获取商圈分布统计
   */
  async getCbdDistribution(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const cbdWithCounts = await this.fastify.prisma.cBD.findMany({
        include: {
          _count: {
            select: {
              shops: true,
              parts: true,
            },
          },
          district: true,
        },
      });

      const formattedDistribution = cbdWithCounts.map(cbd => ({
        id: cbd.id,
        name: cbd.name,
        district: cbd.district.name,
        shopCount: cbd._count.shops,
        partCount: cbd._count.parts,
      }));

      return reply.send({
        code: 200,
        data: formattedDistribution,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取商圈分布统计失败',
      });
    }
  }

  /**
   * 获取商家类型分布
   */
  async getShopTypeDistribution(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const shopTypes = Object.values(ShopType);
      const typeCounts = [];

      for (const type of shopTypes) {
        const count = await this.fastify.prisma.shop.count({
          where: {
            type,
          },
        });

        typeCounts.push({
          type,
          count,
        });
      }

      return reply.send({
        code: 200,
        data: typeCounts,
      });
    } catch (error) {
      this.fastify.log.error(error);
      return reply.status(500).send({
        code: 500,
        data: null,
        error: '获取商家类型分布失败',
      });
    }
  }
}

