import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  PartAddRequest,
  PartDeleteRequest,
  PartDetailRequest,
  PartListRequest,
  PartUpdateRequest
} from '../schemas/part.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';
import { AuditLogService, RequestData } from './auditLog.service.js';
import { prisma } from '@/app/lib/prisma';

export class PartController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取物业小区列表
   */
  async getPartList(
    request: FastifyRequest<{ Body: PartListRequest }>,
    reply: FastifyReply
  ) {
    const { cbdId } = request.body;

    // 构建查询条件
    const where = cbdId ? { cbdId } : {};

    // 查询数据库
    const parts = await this.fastify.prisma.part.findMany({
      where,
      select: {
        id: true,
        name: true,
        sequence: true,
        positions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        sequence: 'desc',
      },
    });

    // 查询total_space
    const total_space = await prisma.space.count({
      where: {
        shop: {
          cbdId,
        }
      },
    })

    // 查询total_position
    const total_position = await prisma.position.count({
      where: {
        part: {
          cbdId,
        },
      },
    })

    // 处理返回数据
    const formattedParts = parts.map((part) => ({
      id: part.id,
      name: part.name,
      sequence: part.sequence,
      total_space,
      total_position,
    }));

    return reply.send(
      formatSuccess({
        list: formattedParts,
      })
    );
  }

  /**
   * 获取分区详情
   */
  async getPartDetail(
    request: FastifyRequest<{ Params: PartDetailRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    // 查询数据库
    const part = await this.fastify.prisma.part.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        sequence: true,
        cbd: {
          select: {
            id: true,
            name: true,
          },
        },
        positions: {
          select: {
            id: true,
            position_no: true,
            shopId: true,
            total_space: true,
            put_space: true,
            price_base: true,
            verified: true,
            displayed: true,
            type: true,
            type_tag: true,
            photo: true,
            remark: true,
            business_hours: true,
          },
        },
      },
    });

    // 查询total_space
    const total_space = await prisma.space.count({
      where: {
        shop: {
          cbdId: part?.cbd?.id,
        }
      },
    })

    // 查询total_position
    const total_position = await prisma.position.count({
      where: {
        part: {
          cbdId: part?.cbd?.id,
        },
      },
    })

    // 处理返回数据
    const formattedPart = {
      id: part?.id,
      name: part?.name,
      sequence: part?.sequence,
      total_space: part?.positions.length,
      cbd: {
        id: part?.cbd?.id,
        name: part?.cbd?.name,
      },
      positions: part?.positions?.map((position) => ({
        id: position.id,
        position_no: position.position_no,
        shopId: position.shopId,
        total_space,
        total_position,
        put_space: position.put_space,
        price_base: position.price_base,
        verified: position.verified,
        displayed: position.displayed,
        type: position.type,
        type_tag: position.type_tag,
        photo: position.photo,
        remark: position.remark,
        business_hours: position.business_hours,
      })),
    };

    return reply.send(
      formatSuccess(formattedPart)
    );
  }

  /**
   * 新增分区
   */
  async addPart(
    request: FastifyRequest<{ Body: PartAddRequest }>,
    reply: FastifyReply
  ) {
    const { cbdId, name, sequence } = request.body;

    // 验证商圈存在
    const existingCbd = await this.fastify.prisma.cBD.findUnique({
      where: { id: cbdId },
    });

    if (!existingCbd) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '商圈不存在'
      });
    }

    // 创建新分区
    const newPart = await this.fastify.prisma.part.create({
      data: {
        name,
        sequence,
        cbdId,
      },
    });
    // 记录审计日志
    await this.fastify.auditLog.logCreate({
      targetType: 'PART',
      targetId: newPart?.id,
      targetName: newPart?.name,
      operatorId: "9527",
      operatorName: "小强",
      details: { ...newPart },
      request: request as unknown as RequestData,
    });
    return reply.send(formatSuccess(''));
  }

  /**
   * 编辑分区
   */
  async updatePart(
    request: FastifyRequest<{ Body: PartUpdateRequest }>,
    reply: FastifyReply
  ) {
    const { id, name } = request.body;

    // 验证分区存在
    const existingPart = await this.fastify.prisma.part.findUnique({
      where: { id },
    });

    if (!existingPart) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '分区不存在'
      });
    }

    // 更新分区
    const newPart = await this.fastify.prisma.part.update({
      where: { id },
      data: { name },
    });

    // 记录审计日志
    await this.fastify.auditLog.logUpdate({
      targetType: 'PART',
      targetId: newPart?.id,
      targetName: newPart?.name,
      operatorId: "9527",
      operatorName: "小强",
      details: AuditLogService.generateChangeDetails(existingPart, newPart),
      request: request as unknown as RequestData,
    });
    return reply.send(formatSuccess(''));
  }

  /**
   * 删除分区
   */
  async deletePart(
    request: FastifyRequest<{ Body: PartDeleteRequest }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;

    // 验证分区存在
    const existingPart = await this.fastify.prisma.part.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    });

    if (!existingPart) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '分区不存在'
      });
    }

    // 验证是否有铺位关联
    if (existingPart.positions.length > 0) {
      return reply.status(400).send({
        code: 400,
        data: null,
        error: '该分区下存在铺位，无法删除'
      });
    }

    // 删除分区
    await this.fastify.prisma.part.delete({
      where: { id },
    });

    // 记录审计日志
    await this.fastify.auditLog.logDelete({
      targetType: 'PART',
      targetId: id,
      targetName: existingPart?.name,
      operatorId: "9527",
      operatorName: "小强",
      details: existingPart,
      request: request as unknown as RequestData,
    });
    return reply.send(formatSuccess(''));
  }
}
