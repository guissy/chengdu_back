import { prisma } from '@/app/lib/prisma'
import { partListResponseSchema, partListSchema } from '@/app/lib/schemas/part'
import { errorResponse, successResponse } from '@/app/lib/utils/response'
import { ErrorWithName } from '@/app/lib/types/prisma'
import { Part, Position } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validatedData = partListSchema.parse(body)

    const { cbdId } = validatedData

    // 查询数据库，找出所有分区
    const parts = await prisma.part.findMany({
      where: cbdId ? {
        cbdId,
      } : {},
      include: {
        positions: true,
      },
    }) as (Part & { positions: Position[] })[]

    // 处理返回数据
    const formattedParts = parts.map((part) => ({
      ...part,
      partId: part.id,
      total_position: part.positions?.length ?? 0,
    }))

    const responseData = {
      list: formattedParts,
    }

    // 验证响应数据
    partListResponseSchema.parse(responseData)

    return successResponse(responseData)
  } catch (error) {
    console.error('Error fetching part list:', error)
    const err = error as ErrorWithName
    if (err.name === 'ZodError') {
      return errorResponse('请求数据验证失败', 400, err.errors)
    }
    return errorResponse('Internal Server Error')
  }
}
