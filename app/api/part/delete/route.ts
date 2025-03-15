import { prisma } from '@/app/lib/prisma'
import { partDeleteSchema } from '@/app/lib/schemas/part'
import { successResponse, errorResponse } from '@/app/lib/utils/response'
import { PartWithPositions, ErrorWithName } from '@/app/lib/types/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validatedData = partDeleteSchema.parse(body)

    const { id } = validatedData

    // 验证分区是否存在
    const existingPart = await prisma.part.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    }) as PartWithPositions

    if (!existingPart) {
      return errorResponse('分区不存在', 404)
    }

    // 检查是否有关联的铺位
    if (existingPart.positions && existingPart.positions.length > 0) {
      return errorResponse('该分区还有关联的铺位，无法删除', 400)
    }

    // 删除分区
    await prisma.part.delete({
      where: { id },
    })

    return successResponse(null)
  } catch (error) {
    console.error('Error deleting part:', error)
    const err = error as ErrorWithName
    if (err.name === 'ZodError') {
      return errorResponse('请求数据验证失败', 400, err.errors)
    }
    return errorResponse('Internal Server Error')
  }
} 