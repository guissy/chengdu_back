import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { formatSuccess } from '../utils/response-formatter.js';

export class CityController {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取城市列表
   */
  async getCityList(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // 查询数据库
    const cities = await this.fastify.prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return reply.send(
      formatSuccess({
        list: cities,
      })
    );
  }
}
