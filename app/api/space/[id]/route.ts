import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { SpaceUpdateRequestSchema } from '@/lib/schema/space'
import { SpaceType, SpaceState, SpaceSite, SpaceStability } from '@prisma/client'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string(),
})


// 获取广告位详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证路径参数
    const result = paramsSchema.safeParse(await params)
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

