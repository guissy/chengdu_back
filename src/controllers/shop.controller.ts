import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  ShopListUnbindRequest,
  ShopAddRequest,
  ShopUpdateRequest,
  ShopDeleteRequest, ShopDetailRequest,
} from '../schemas/shop.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';

export class ShopController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取商家列表
   */
  async getShopList(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // 查询数据库，找出所有商家
    const shops = await this.fastify.prisma.shop.findMany({
      include: {
        spaces: true,
      },
    });

    // 处理返回数据
    const formattedShops = shops.map((shop) => ({
      ...shop,
      shopId: shop.id,
      total_space: shop.spaces?.length,
      put_space: shop.spaces?.filter((space) => space.state === 1).length,
      photo: shop.environment_photo.concat(shop.building_photo),
    }));

    return reply.send(
      formatSuccess({
        list: formattedShops,
      })
    );
  }

  /**
   * 获取未关联商家列表
   */
  async getUnbindShopList(
    request: FastifyRequest<{ Body: ShopListUnbindRequest }>,
    reply: FastifyReply
  ) {
    // 查询数据库，找出所有未关联铺位的商家
    const shops = await this.fastify.prisma.shop.findMany({
      where: {
        position: {
          is: null
        },
      },
      include: {
        spaces: true,
      },
    });

    // 处理返回数据
    const formattedShops = shops.map((shop) => ({
      ...shop,
      shopId: shop.id,
      total_space: shop.spaces?.length,
      put_space: shop.spaces?.filter((space) => space.state === 1).length,
      photo: shop.environment_photo.concat(shop.building_photo),
    }));

    return reply.send(
      formatSuccess({
        list: formattedShops,
      })
    );
  }

  /**
   * 获取商家详情
   */
  async getShopDetail(
    request: FastifyRequest<ShopDetailRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    // 查询数据库，找出商家详情
    const shop = await this.fastify.prisma.shop.findUnique({
      where: { id },
      include: {
        spaces: true,
        position: true,
      },
    });

    if (!shop) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商家不存在',
      });
    }

    // // 处理返回数据
    const formattedShop = {
      ...shop,
      shopId: shop.id,
      total_space: shop.spaces?.length,
      put_space: shop.spaces?.filter((space) => space.state === 1).length,
      photo: shop.environment_photo.concat(shop.building_photo),
    };
    return reply.send(
      formatSuccess(formattedShop)
    );
  }

  /**
   * 新建商家
   */
  async addShop(
    request: FastifyRequest<{ Body: ShopAddRequest }>,
    reply: FastifyReply
  ) {
    const {
      cbdId,
      partId,
      positionId,
      type,
      type_tag,
      business_type,
      trademark,
      branch,
      location,
      verified,
      duration,
      consume_display,
      average_expense,
      sex,
      age,
      id_tag,
      sign_photo,
      verify_photo,
      environment_photo,
      building_photo,
      brand_photo,
      contact_name,
      contact_phone,
      contact_type,
      total_area,
      customer_area,
      clerk_count,
      business_hours,
      rest_days,
      volume_peak,
      season,
      shop_description,
      put_description,
      displayed,
      price_base,
      classify_tag,
      remark,
    } = request.body;

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

    // 验证铺位存在
    if (positionId) {
      const existingPosition = await this.fastify.prisma.position.findUnique({
        where: { id: positionId },
      });

      if (!existingPosition) {
        return reply.status(404).send({
          code: 404,
          data: null,
          error: '铺位不存在',
        });
      }

      // 验证铺位是否已被占用
      if (existingPosition.shopId) {
        return reply.status(400).send({
          code: 400,
          data: null,
          error: '铺位已被占用',
        });
      }
    }

    // 生成商家编号
    const shopCount = await this.fastify.prisma.shop.count();
    const shop_no = `SH${(shopCount + 1).toString().padStart(5, '0')}`;

    // 创建商家
    const newShop = await this.fastify.prisma.shop.create({
      data: {
        shop_no,
        cbdId: cbdId,
        partId: partId,
        type,
        type_tag,
        business_type: business_type,
        trademark,
        branch,
        location,
        verified: verified || false,
        duration,
        consume_display: consume_display || true,
        average_expense,
        sex: sex || 1,
        age,
        id_tag,
        sign_photo,
        verify_photo: verify_photo || [],
        environment_photo: environment_photo || [],
        building_photo: building_photo || [],
        brand_photo: brand_photo || [],
        contact_name,
        contact_phone,
        contact_type,
        total_area,
        customer_area,
        clerk_count,
        business_hours,
        rest_days,
        volume_peak,
        season,
        shop_description,
        put_description,
        displayed: displayed || true,
        price_base,
        classify_tag,
        remark,
      },
    });

    if (positionId) {
      // 更新铺位关联
      await this.fastify.prisma.position.update({
        where: { id: positionId },
        data: { shopId: newShop.id },
      });
    }

    return reply.send(
      formatSuccess({
        id: newShop.id,
      })
    );
  }

  /**
   * 编辑商家
   */
  async updateShop(
    request: FastifyRequest<{ Body: ShopUpdateRequest }>,
    reply: FastifyReply
  ) {
    const {
      id,
      type,
      type_tag,
      business_type,
      trademark,
      branch,
      location,
      verified,
      duration,
      consume_display,
      average_expense,
      sex,
      age,
      id_tag,
      sign_photo,
      verify_photo,
      environment_photo,
      building_photo,
      brand_photo,
      contact_name,
      contact_phone,
      contact_type,
      total_area,
      customer_area,
      clerk_count,
      business_hours,
      rest_days,
      volume_peak,
      season,
      shop_description,
      put_description,
      displayed,
      price_base,
      classify_tag,
      remark,
    } = request.body;

    // 验证商家存在
    const existingShop = await this.fastify.prisma.shop.findUnique({
      where: { id },
    });

    if (!existingShop) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商家不存在',
      });
    }

    // 更新商家
    await this.fastify.prisma.shop.update({
      where: { id },
      data: {
        type,
        type_tag,
        business_type: business_type,
        trademark,
        branch,
        location,
        verified,
        duration,
        consume_display,
        average_expense,
        sex,
        age,
        id_tag,
        sign_photo,
        verify_photo,
        environment_photo,
        building_photo,
        brand_photo,
        contact_name,
        contact_phone,
        contact_type,
        total_area,
        customer_area,
        clerk_count,
        business_hours,
        rest_days,
        volume_peak,
        season,
        shop_description,
        put_description,
        displayed,
        price_base,
        classify_tag,
        remark,
      },
    });

    return reply.send(formatSuccess({}));
  }

  /**
   * 删除商家
   */
  async deleteShop(
    request: FastifyRequest<{ Body: ShopDeleteRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;

    // 验证商家存在
    const existingShop = await this.fastify.prisma.shop.findUnique({
      where: { id },
      include: {
        spaces: true,
        position: true,
      },
    });

    if (!existingShop) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商家不存在',
      });
    }

    // 验证是否有广告位关联
    if (existingShop.spaces.length > 0) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '该商家下存在广告位，无法删除',
      });
    }

    // 开始事务
    await this.fastify.prisma.$transaction(async (prisma) => {
      // 删除商家
      await prisma.shop.delete({
        where: { id },
      });
    });

    return reply.send(formatSuccess(''));
  }
}
