import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string(),
})

// 获取商家详情
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

    const shop = await prisma.shop.findUnique({
      where: { id: result.data.id },
      include: {
        position: true,
        part: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!shop) {
      return errorResponse('Shop not found', 404)
    }

    // 转换数据格式
    const response = {
      id: shop.id,
      shop_no: shop.shop_no,
      // name: shop.name,
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
      positions: shop.position ? [{
        positionId: shop.position.id,
        position_no: shop.position.position_no,
        partId: shop.part.id,
        part_name: shop.part.name,
      }] : [],
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching shop:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 删除商家
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证路径参数
    const result = paramsSchema.safeParse(await params)
    if (!result.success) {
      return errorResponse('Invalid parameters', 400, result.error)
    }

    const shop = await prisma.shop.findUnique({
      where: { id: result.data.id },
      include: {
        position: true,
      },
    })

    if (!shop) {
      return errorResponse('Shop not found', 404)
    }

    // 检查是否有关联的铺位
    if (shop.position) {
      return errorResponse('Cannot delete shop with associated position', 400)
    }

    // 删除商家
    await prisma.shop.delete({
      where: { id: result.data.id },
    })

    return successResponse({
      message: 'Shop deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 
