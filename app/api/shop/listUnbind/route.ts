import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { ShopListResponseSchema } from '@/lib/schema/shop'

/**
 * @desc: 获取未绑定铺位的商铺列表
 * @response: ShopListResponse
 */
export async function GET() {
  try {
    // 查询未绑定铺位的商家列表
    const shops = await prisma.shop.findMany({
      where: {
        position: null,
      },
      include: {
        position: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 转换数据格式
    const list = shops.map(shop => ({
      ...shop,
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