import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { PositionListRequestSchema, PositionListResponseSchema } from '@/lib/schema/position'

/**
 * @desc: 获取铺位列表
 * @body: PositionListRequest
 * @response: PositionListResponse
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求参数
    const requestResult = PositionListRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { partId } = requestResult.data

    // 构建查询条件
    const where = partId ? { partId } : {}

    // 查询铺位列表
    const positions = await prisma.position.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
          },
        },
      },
      orderBy: {
        position_no: 'asc',
      },
    })

    // 转换数据格式
    const list = positions.map(pos => ({
      positionId: pos.id,
      position_no: pos.position_no,
      shopId: pos.shop?.id || null,
      shop_no: pos.shop?.shop_no || null,
      total_space: pos.total_space,
      put_space: pos.put_space,
      price_base: pos.price_base,
      verified: pos.verified,
      displayed: pos.displayed,
      type: pos.type,
      type_tag: pos.type_tag,
      photo: pos.photo,
      remark: pos.remark,
      business_hours: pos.business_hours,
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = PositionListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

/**
 * @desc: 获取铺位列表
 * @query: PositionListRequest
 * @response: PositionListResponse
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const body = {
      partId: searchParams.get('partId') || undefined,
    }
    
    // 验证请求参数
    const requestResult = PositionListRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { partId } = requestResult.data

    // 构建查询条件
    const where = partId ? { partId } : {}

    // 查询铺位列表
    const positions = await prisma.position.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
          },
        },
      },
      orderBy: {
        position_no: 'asc',
      },
    })

    // 转换数据格式
    const list = positions.map(pos => ({
      positionId: pos.id,
      position_no: pos.position_no,
      shopId: pos.shop?.id || null,
      shop_no: pos.shop?.shop_no || null,
      total_space: pos.total_space,
      put_space: pos.put_space,
      price_base: pos.price_base,
      verified: pos.verified,
      displayed: pos.displayed,
      type: pos.type,
      type_tag: pos.type_tag,
      photo: pos.photo,
      remark: pos.remark,
      business_hours: pos.business_hours,
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = PositionListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 