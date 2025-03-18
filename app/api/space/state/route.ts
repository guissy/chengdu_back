import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { SpaceStateUpdateRequestSchema } from '@/lib/schema/space'
import { SpaceState } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求参数
    const requestResult = SpaceStateUpdateRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { id, state } = requestResult.data

    // 检查广告位是否存在
    const existingSpace = await prisma.space.findUnique({
      where: { id },
    })

    if (!existingSpace) {
      return errorResponse('Space not found', 404)
    }

    // 更新广告位状态
    const space = await prisma.space.update({
      where: { id },
      data: {
        state: state as SpaceState,
      },
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
            // name: true,
          },
        },
      },
    })

    return successResponse({
      id: space.id,
      type: space.type,
      state: space.state,
      shop: {
        id: space.shop.id,
        shop_no: space.shop.shop_no,
        // name: space.shop.name,
      },
    })
  } catch (error) {
    console.error('Error updating space state:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 