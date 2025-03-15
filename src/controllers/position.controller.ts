import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  PositionListRequest,
  PositionAddRequest,
  PositionUpdateRequest,
  PositionDeleteRequest,
  PositionSetEmptyRequest,
  PositionBindShopRequest,
  PositionMarkRequest, PositionDetailRequest,
} from '../schemas/position.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';
import { PartDetailRequest } from '../schemas/part.schema.js';

export class PositionController {
  constructor(private fastify: FastifyInstance) {
  }

  /**
   * 获取铺位列表
   */
  async getPositionList(
    request: FastifyRequest<{ Body: PositionListRequest }>,
    reply: FastifyReply
  ) {
    const { partId } = request.body;

    // 构建查询条件
    const where = partId ? { partId } : {};

    // 查询数据库
    const positions = await this.fastify.prisma.position.findMany({
      where,
      include: {
        shop: {
          select: {
            shop_no: true,
          },
        },
      },
    });

    // 处理返回数据
    const formattedPositions = positions.map((position) => ({
      positionId: position.id,
      position_no: position.position_no,
      shopId: position.shopId,
      shop_no: position.shop?.shop_no || null,
      total_space: position.total_space,
      put_space: position.put_space,
      price_base: position.price_base,
      verified: position.verified,
      displayed: position.displayed,
      type: position.type,
      type_tag: position.type_tag,
      photo: position.photo,
      remark: position.remark,
      business_hours: position.business_hours,
    }));

    return reply.send(
      formatSuccess({
        list: formattedPositions,
      })
    );
  }

  /**
   * 获取铺位详情
   */
  async getPositionDetail(
    request: FastifyRequest<{ Params: PositionDetailRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const position = await this.fastify.prisma.position.findUnique({
      where: { id },
      include: {
        part: {
          select: {
            id: true,
          },
        },
        shop: {
          select: {
            shop_no: true,
          },
        },
      },
    });

    if (!position) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

    const formattedPosition = {
      positionId: position.id,
      position_no: position.position_no,
      partId: position.partId,
      cbdId: position.part.id,
      shopId: position.shopId,
      shop_no: position.shop?.shop_no || null,
      total_space: position.total_space,
      put_space: position.put_space,
      price_base: position.price_base,
      verified: position.verified,
      displayed: position.displayed,
      type: position.type,
      type_tag: position.type_tag,
      photo: position.photo,
      remark: position.remark,
      business_hours: position.business_hours,
    };

    return reply.send(
      formatSuccess(formattedPosition)
    );
  }

  /**
   * 新增铺位
   */
  async addPosition(
    request: FastifyRequest<{ Body: PositionAddRequest }>,
    reply: FastifyReply
  ) {
    const { cbdId, partId, no } = request.body;

    // 验证商圈存在
    const existingCbd = await this.fastify.prisma.cBD.findUnique({
      where: { id: cbdId },
    });

    if (!existingCbd) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商圈不存在',
      });
    }

    // 验证分区存在
    const existingPart = await this.fastify.prisma.part.findUnique({
      where: { id: partId },
    });

    if (!existingPart) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '分区不存在',
      });
    }

    // 验证商圈和分区关系
    if (existingPart.cbdId !== cbdId) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '分区不属于该商圈',
      });
    }

    // 验证铺位编号唯一性
    const existingPosition = await this.fastify.prisma.position.findFirst({
      where: {
        position_no: no,
        partId,
      },
    });

    if (existingPosition) {
      return reply.status(409).send({
        code: 409,
        data: null,
        error: '铺位编号已存在',
      });
    }

    // 创建新铺位
    await this.fastify.prisma.position.create({
      data: {
        position_no: no,
        partId,
        price_base: 0, // 默认价格基数
        photo: [],
        business_hours: [],
      },
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 编辑铺位
   */
  async updatePosition(
    request: FastifyRequest<{ Body: PositionUpdateRequest }>,
    reply: FastifyReply
  ) {
    const { id, no } = request.body;

    // 验证铺位存在
    const existingPosition = await this.fastify.prisma.position.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

    // 验证铺位编号唯一性
    const duplicatePosition = await this.fastify.prisma.position.findFirst({
      where: {
        position_no: no,
        partId: existingPosition.partId,
        id: { not: id },
      },
    });

    if (duplicatePosition) {
      return reply.status(409).send({
        code: 409,
        data: null,
        error: '铺位编号已存在',
      });
    }

    // 更新铺位
    await this.fastify.prisma.position.update({
      where: { id },
      data: { position_no: no },
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 删除铺位
   */
  async deletePosition(
    request: FastifyRequest<{ Body: PositionDeleteRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;

    // 验证铺位存在
    const existingPosition = await this.fastify.prisma.position.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });

    if (!existingPosition) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

    // 验证是否有商家关联
    if (existingPosition.shop) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '该铺位已关联商家，请先解除关联',
      });
    }

    // 删除铺位
    await this.fastify.prisma.position.delete({
      where: { id },
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 置为空铺
   */
  async setEmptyPosition(
    request: FastifyRequest<{ Body: PositionSetEmptyRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;

    // 验证铺位存在
    const existingPosition = await this.fastify.prisma.position.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

    // 检查铺位是否已经是空铺
    if (!existingPosition.shopId) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '铺位已经是空铺',
      });
    }

    // 更新铺位，解除与商家的关联
    await this.fastify.prisma.position.update({
      where: { id },
      data: { shopId: null },
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 关联新商家
   */
  async bindShop(
    request: FastifyRequest<{ Body: PositionBindShopRequest }>,
    reply: FastifyReply
  ) {
    const { id, shopId } = request.body;

    // 验证铺位存在
    const existingPosition = await this.fastify.prisma.position.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

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

    // 检查铺位是否已经关联了商家
    if (existingPosition.shopId) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '铺位已关联其他商家，请先解除关联',
      });
    }

    // 检查商家是否已经关联了铺位
    const shopPositions = await this.fastify.prisma.position.findMany({
      where: { shopId },
    });

    if (shopPositions.length > 0) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '商家已关联其他铺位',
      });
    }

    // 更新铺位，关联商家
    await this.fastify.prisma.position.update({
      where: { id },
      data: { shopId },
    });

    return reply.send(formatSuccess(''));
  }

  /**
   * 快速标记铺位
   */
  async markPosition(
    request: FastifyRequest<{ Body: PositionMarkRequest }>,
    reply: FastifyReply
  ) {
    const { id, remark } = request.body;

    // 验证铺位存在
    const existingPosition = await this.fastify.prisma.position.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '铺位不存在',
      });
    }

    // 更新铺位备注
    await this.fastify.prisma.position.update({
      where: { id },
      data: { remark },
    });

    return reply.send(formatSuccess(''));
  }
}
