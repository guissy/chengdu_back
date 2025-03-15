import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  SpaceListRequest,
  SpaceAddRequest,
  SpaceUpdateRequest,
  SpaceDeleteRequest,
  SpaceUpdateStateRequest,
} from '../schemas/space.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';

export class SpaceController {
  constructor(private fastify: FastifyInstance) {
  }

  /**
   * 获取广告位列表
   */
  async getSpaceList(
    request: FastifyRequest<{ Body: SpaceListRequest }>,
    reply: FastifyReply
  ) {
    const { shopId } = request.body;
    // 查询数据库
    const spaces = await this.fastify.prisma.space.findMany(shopId ?{
      where: { shopId },
      include: { shop: true },
    } : {});

    // 处理返回数据
    const formattedSpaces = spaces.map((space) => ({
      id: space.id,
      type: space.type,
      setting: space.setting,
      count: space.count,
      state: space.state,
      photo: space.photo,
      priceFactor: space.price_factor,
      updatedAt: space.updatedAt,
      shopId: space.shopId,
      shop: {
        trademark: space.shop?.trademark,
        shop_no: space.shop?.shop_no,
      }
    }));

    return reply.send(
      formatSuccess({
        list: formattedSpaces,
      })
    );
  }

  /**
   * 获取广告位详情
   */
  async getSpaceDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    // 验证广告位存在
    const existingSpace = await this.fastify.prisma.space.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!existingSpace) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '广告位不存在',
      });
    }

    // 处理返回数据
    const formattedSpace = {
      id: existingSpace.id,
      type: existingSpace.type,
      setting: existingSpace.setting,
      count: existingSpace.count,
      state: existingSpace.state,
      photo: existingSpace.photo,
      priceFactor: existingSpace.price_factor,
      tag: existingSpace.tag,
      site: existingSpace.site,
      stability: existingSpace.stability,
      description: existingSpace.description,
      design_attention: existingSpace.design_attention,
      construction_attention: existingSpace.construction_attention,
      updatedAt: existingSpace.updatedAt,
      shopId: existingSpace.shopId,
      shop: {
        trademark: existingSpace.shop?.trademark,
        shop_no: existingSpace.shop?.shop_no,
      }
    };
    return reply.send(formatSuccess(formattedSpace));
  }

  /**
   * 新建广告位
   */
  async addSpace(
    request: FastifyRequest<{ Body: SpaceAddRequest }>,
    reply: FastifyReply
  ) {
    const {
      shopId,
      type,
      setting,
      count,
      state,
      priceFactor,
      tag,
      site,
      stability,
      photo,
      description,
      design_attention,
      construction_attention,
    } = request.body;

    // 验证商家存在
    const existingShop = await this.fastify.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!existingShop) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商家不存在',
      });
    }

    // 创建广告位
    await this.fastify.prisma.space.create({
      data: {
        shopId,
        type,
        setting,
        count: count || 1,
        state: state || 1,
        price_factor: priceFactor || 1.0,
        tag,
        site,
        stability,
        photo: photo || [],
        description,
        design_attention,
        construction_attention,
      },
    });

    // 更新商家的广告位总数
    await this.fastify.prisma.position.updateMany({
      where: { shopId },
      data: {
        total_space: {
          increment: count || 1,
        },
      },
    });

    return reply.send(formatSuccess({}));
  }

  /**
   * 编辑广告位
   */
  async updateSpace(
    request: FastifyRequest<{ Body: SpaceUpdateRequest }>,
    reply: FastifyReply
  ) {
    const {
      id,
      type,
      setting,
      count,
      state,
      price_factor,
      tag,
      site,
      stability,
      photo,
      description,
      design_attention,
      construction_attention,
    } = request.body;

    // 验证广告位存在
    const existingSpace = await this.fastify.prisma.space.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!existingSpace) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '广告位不存在',
      });
    }

    // 计算广告位数量的差值
    const countDifference = (count || existingSpace.count) - existingSpace.count;

    // 开始事务
    await this.fastify.prisma.$transaction(async (prisma) => {
      // 更新广告位
      await prisma.space.update({
        where: { id },
        data: {
          type,
          setting,
          count,
          state,
          price_factor,
          tag,
          site,
          stability,
          photo,
          description,
          design_attention,
          construction_attention,
        },
      });

      // 如果广告位数量有变化，更新商家的广告位总数
      if (countDifference !== 0) {
        await prisma.position.updateMany({
          where: { shopId: existingSpace.shopId },
          data: {
            total_space: {
              increment: countDifference,
            },
          },
        });
      }
    });

    return reply.send(formatSuccess({}));
  }

  /**
   * 删除广告位
   */
  async deleteSpace(
    request: FastifyRequest<{ Body: SpaceDeleteRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;

    // 验证广告位存在
    const existingSpace = await this.fastify.prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '广告位不存在',
      });
    }

    // 开始事务
    await this.fastify.prisma.$transaction(async (prisma) => {
      // 删除广告位
      await prisma.space.delete({
        where: { id },
      });

      // 更新商家的广告位总数
      await prisma.position.updateMany({
        where: { shopId: existingSpace.shopId },
        data: {
          total_space: {
            decrement: existingSpace.count,
          },
        },
      });
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 启用/禁用广告位
   */
  async updateSpaceState(
    request: FastifyRequest<{ Body: SpaceUpdateStateRequest }>,
    reply: FastifyReply
  ) {
    const { id, state } = request.body;

    // 验证广告位存在
    const existingSpace = await this.fastify.prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '广告位不存在',
      });
    }

    // 如果状态没有变化，直接返回成功
    if (existingSpace.state === state) {
      return reply.send(formatSuccess(''));
    }

    // 开始事务
    await this.fastify.prisma.$transaction(async (prisma) => {
      // 更新广告位状态
      await prisma.space.update({
        where: { id },
        data: { state },
      });

      // 更新商家的已投放广告位数量
      const difference = state === 1 ? existingSpace.count : -existingSpace.count;

      await prisma.position.updateMany({
        where: { shopId: existingSpace.shopId },
        data: {
          put_space: {
            increment: difference,
          },
        },
      });
    });

    return reply.send(formatSuccess(''));
  }
}
