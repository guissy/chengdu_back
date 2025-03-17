import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { SpaceUpdateRequestSchema } from '@/lib/schema/space'
import { SpaceType, SpaceState, SpaceSite, SpaceStability } from '@prisma/client'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string(),
})

// 更新广告位
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证路径参数
    const paramsResult = paramsSchema.safeParse(params)
    if (!paramsResult.success) {
      return errorResponse('Invalid parameters', 400, paramsResult.error)
    }

    const body = await request.json()
    
    // 验证请求参数
    const requestResult = SpaceUpdateRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const {
      type,
      setting,
      count,
      state,
      price_factor,
      tag,
      site,
      stability,
      photo,
      description,
      design_attention,
      construction_attention,
    } = requestResult.data

    // 检查广告位是否存在
    const existingSpace = await prisma.space.findUnique({
      where: { id: params.id },
    })

    if (!existingSpace) {
      return errorResponse('Space not found', 404)
    }

    // 更新广告位
    const space = await prisma.space.update({
      where: { id: params.id },
      data: {
        ...(type && { type: type as SpaceType }),
        ...(setting && { setting }),
        ...(count && { count }),
        ...(state && { state: state as SpaceState }),
        ...(price_factor && { price_factor }),
        ...(tag !== undefined && { tag }),
        ...(site && { site: site as SpaceSite }),
        ...(stability && { stability: stability as SpaceStability }),
        ...(photo && { photo }),
        ...(description !== undefined && { description }),
        ...(design_attention !== undefined && { design_attention }),
        ...(construction_attention !== undefined && { construction_attention }),
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

    return successResponse({
      id: space.id,
      type: space.type,
      count: space.count,
      state: space.state,
      shop: {
        id: space.shop.id,
        shop_no: space.shop.shop_no,
        name: space.shop.name,
      },
    })
  } catch (error) {
    console.error('Error updating space:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 获取广告位详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证路径参数
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      return errorResponse('Invalid parameters', 400, result.error)
    }

    const space = await prisma.space.findUnique({
      where: { id: params.id },
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

    if (!space) {
      return errorResponse('Space not found', 404)
    }

    // 转换数据格式
    const response = {
      id: space.id,
      type: space.type,
      setting: space.setting,
      count: space.count,
      state: space.state,
      price_factor: space.price_factor,
      tag: space.tag,
      site: space.site,
      stability: space.stability,
      photo: space.photo,
      description: space.description,
      design_attention: space.design_attention,
      construction_attention: space.construction_attention,
      shop: {
        id: space.shop.id,
        shop_no: space.shop.shop_no,
        name: space.shop.name,
      },
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching space:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 删除广告位
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证路径参数
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      return errorResponse('Invalid parameters', 400, result.error)
    }

    const space = await prisma.space.findUnique({
      where: { id: params.id },
    })

    if (!space) {
      return errorResponse('Space not found', 404)
    }

    // 删除广告位
    await prisma.space.delete({
      where: { id: params.id },
    })

    return successResponse({
      message: 'Space deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting space:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 