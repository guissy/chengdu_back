import { prisma } from '@/app/lib/prisma'
import { positionListSchema, positionListResponseSchema } from '@/app/lib/schemas/position'
import { successResponse, errorResponse } from '@/app/lib/utils/response'
import { NextRequest } from 'next/server'
import { Position } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validatedData = positionListSchema.parse(body)

    const { partId } = validatedData

    // 查询数据库，找出所有铺位
    const positions = await prisma.position.findMany({
      where: {
        partId,
      },
    }) as Position[]

    const responseData = {
      list: positions,
    }

    // 验证响应数据
    positionListResponseSchema.parse(responseData)

    return successResponse(responseData)
  } catch (error) {
    console.error('Error fetching position list:', error)
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return errorResponse('请求数据验证失败', 400, error)
      }
    }
    return errorResponse('Internal Server Error')
  }
} 