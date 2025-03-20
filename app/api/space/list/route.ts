import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { SpaceListRequestSchema, SpaceListResponseSchema } from '@/lib/schema/space'
import { SpaceType, SpaceState, SpaceSite, SpaceStability } from '@prisma/client'

/**
 * @desc: 获取空间列表
 * @body: SpaceListRequest
 * @response: SpaceListResponse
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求参数
    const requestResult = SpaceListRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { shopId, type, state, site, stability } = requestResult.data

    // 构建查询条件
    const where = {
      ...(shopId ? { shopId } : {}),
      ...(type ? { type: type as SpaceType } : {}),
      ...(state ? { state: state as SpaceState } : {}),
      ...(site ? { site: site as SpaceSite } : {}),
      ...(stability ? { stability: stability as SpaceStability } : {}),
    }

    // 查询广告位列表
    const spaces = await prisma.space.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
            trademark: true,
            branch: true,
            type_tag: true
            // name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 转换数据格式
    const list = spaces.map(space => ({
      id: space.id,
      type: space.type,
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
      shopId: space.shop.id,
      shop: {
        id: space.shop.id,
        shop_no: space.shop.shop_no,
        // name: space.shop.name,
      },
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = SpaceListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

/**
 * @desc: 获取空间列表
 * @query: SpaceListRequest
 * @response: SpaceListResponse
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const body = {
      shopId: searchParams.get('shopId') || undefined,
      type: searchParams.get('type') || undefined,
      state: searchParams.get('state') || undefined,
      site: searchParams.get('site') || undefined,
      stability: searchParams.get('stability') || undefined,
    }

    // 验证请求参数
    const requestResult = SpaceListRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { shopId, type, state, site, stability } = requestResult.data

    // 构建查询条件
    const where = {
      ...(shopId ? { shopId } : {}),
      ...(type ? { type: type as SpaceType } : {}),
      ...(state ? { state: state as SpaceState } : {}),
      ...(site ? { site: site as SpaceSite } : {}),
      ...(stability ? { stability: stability as SpaceStability } : {}),
    }

    // 查询广告位列表
    const spaces = await prisma.space.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
            // name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 转换数据格式
    const list = spaces.map(space => ({
      id: space.id,
      type: space.type,
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
        // name: space.shop.name,
      },
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = SpaceListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
