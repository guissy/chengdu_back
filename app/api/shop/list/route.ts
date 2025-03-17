import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { ShopListRequestSchema, ShopListResponseSchema } from '@/lib/schema/shop'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求参数
    const requestResult = ShopListRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { cbdId, keyword } = requestResult.data

    // 构建查询条件
    const where = {
      ...(cbdId ? { positions: { some: { part: { cbdId } } } } : {}),
      ...(keyword ? {
        OR: [
          { shop_no: { contains: keyword } },
          { name: { contains: keyword } },
          { contact_name: { contains: keyword } },
          { contact_phone: { contains: keyword } },
        ],
      } : {}),
    }

    // 查询商家列表
    const shops = await prisma.shop.findMany({
      where,
      include: {
        positions: {
          select: {
            id: true,
            position_no: true,
            part: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        shop_no: 'asc',
      },
    })

    // 转换数据格式
    const list = shops.map(shop => ({
      id: shop.id,
      shop_no: shop.shop_no,
      name: shop.name,
      contact_name: shop.contact_name,
      contact_phone: shop.contact_phone,
      positions: shop.positions.map(pos => ({
        positionId: pos.id,
        position_no: pos.position_no,
        partId: pos.part.id,
        part_name: pos.part.name,
      })),
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = ShopListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching shops:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 