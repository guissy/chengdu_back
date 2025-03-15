import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CbdListRequest } from '../schemas/cbd.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';

export class CbdController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取商圈列表
   */
  async getCbdList(
    request: FastifyRequest<{ Body: CbdListRequest }>,
    reply: FastifyReply
  ) {
    const { districtId } = request.body;

    // 验证区域存在
    const existingDistrict = await this.fastify.prisma.district.findUnique({
      where: { id: districtId },
    });

    if (!existingDistrict) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '行政区划不存在',
      });
    }

    // 查询数据库
    const cbds = await this.fastify.prisma.cBD.findMany({
      where: { districtId: districtId },
      select: {
        id: true,
        name: true,
        addr: true,
      },
    });

    return reply.send(
      formatSuccess({
        list: cbds,
      })
    );
  }
}
