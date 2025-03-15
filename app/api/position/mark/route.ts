import { prisma } from '@/app/lib/prisma'
import { positionMarkSchema } from '@/app/lib/schemas/position'
import { successResponse, errorResponse } from '@/app/lib/utils/response'
import { NextRequest } from 'next/server'
import { Position } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validatedData = positionMarkSchema.parse(body)

    const { id, state } = validatedData

    // 验证铺位是否存在
    const existingPosition = await prisma.position.findUnique({
      where: { id },
    }) as Position

    if (!existingPosition) {
      return errorResponse('铺位不存在', 404)
    }

    // 更新铺位状态
    await prisma.position.update({
      where: { id },
      data: {
        remark: body.remark,
      },
    })

    return successResponse(null)
  } catch (error) {
    console.error('Error marking position:', error)
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return errorResponse('请求数据验证失败', 400, error)
      }
    }
    return errorResponse('Internal Server Error')
  }
}
