import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DistrictListRequest } from '../schemas/district.schema.js';
import { formatSuccess } from '../utils/response-formatter.js';

export class DistrictController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取区域列表
   */
  async getDistrictList(
    request: FastifyRequest<{ Body: DistrictListRequest }>,
    reply: FastifyReply
  ) {
    const { parentId } = request.body;

    // 验证城市存在
    const existingCity = await this.fastify.prisma.city.findUnique({
      where: { id: parentId },
    });

    if (!existingCity) {
      return reply.status(404).send({
        code: 404,
        data: null,
        error: '城市不存在',
      });
    }

    // 查询数据库
    const districts = await this.fastify.prisma.district.findMany({
      where: { cityId: parentId },
      select: {
        id: true,
        name: true,
      },
    });

    return reply.send(
      formatSuccess({
        list: districts,
      })
    );
  }
}
