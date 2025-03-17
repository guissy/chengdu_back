import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { ShopListResponseSchema } from '@/lib/schema/shop'

export async function GET(request: NextRequest) {
  try {
    // 查询未绑定铺位的商家列表
    const shops = await prisma.shop.findMany({
      where: {
        position: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 转换数据格式
    const list = shops.map(shop => ({
      shopId: shop.id,
      shop_no: shop.shop_no,
      name: shop.name,
      contact_name: shop.contact_name,
      contact_phone: shop.contact_phone,
      business_type: shop.business_type,
      trademark: shop.trademark,
      branch: shop.branch,
      average_expense: shop.average_expense,
      total_area: shop.total_area,
      customer_area: shop.customer_area,
      clerk_count: shop.clerk_count,
      business_hours: shop.business_hours,
      rest_days: shop.rest_days,
      shop_description: shop.shop_description,
      verified: shop.verified,
      displayed: shop.displayed,
    }))

    const response = { list }

    // 验证响应数据
    const responseResult = ShopListResponseSchema.safeParse({ data: response })
    if (!responseResult.success) {
      return errorResponse('Invalid response format', 500, responseResult.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching unbind shops:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 