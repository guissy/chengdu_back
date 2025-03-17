import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { SpaceBatchStateUpdateRequestSchema } from '@/lib/schema/space'
import { SpaceState } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求参数
    const requestResult = SpaceBatchStateUpdateRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { ids, state } = requestResult.data

    // 检查所有广告位是否存在
    const existingSpaces = await prisma.space.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    if (existingSpaces.length !== ids.length) {
      return errorResponse('Some spaces not found', 404)
    }

    // 批量更新广告位状态
    await prisma.space.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        state: state as SpaceState,
      },
    })

    // 获取更新后的广告位列表
    const updatedSpaces = await prisma.space.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
            name: true,
          },
        },
      },
    })

    const list = updatedSpaces.map(space => ({
      id: space.id,
      type: space.type,
      state: space.state,
      shop: {
        id: space.shop.id,
        shop_no: space.shop.shop_no,
        name: space.shop.name,
      },
    }))

    return successResponse({ list })
  } catch (error) {
    console.error('Error updating space states:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 