import { prisma } from '@/app/lib/prisma'
import { partResponseSchema } from '@/app/lib/schemas/part'
import { errorResponse, successResponse } from '@/app/lib/utils/response'
import { ErrorWithName, PartWithPositions } from '@/app/lib/types/prisma'
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id

    // 查询数据库，找出分区详情
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    }) as PartWithPositions

    if (!part) {
      return errorResponse('分区不存在', 404)
    }

    // 处理返回数据
    const formattedPart = {
      ...part,
      partId: part.id,
      total_position: part.positions?.length ?? 0,
    }

    // 验证响应数据
    partResponseSchema.parse(formattedPart)

    return successResponse(formattedPart)
  } catch (error) {
    console.error('Error fetching part detail:', error)
    const err = error as ErrorWithName
    if (err.name === 'ZodError') {
      return errorResponse('请求数据验证失败', 400, err.errors)
    }
    return errorResponse('Internal Server Error')
  }
}
