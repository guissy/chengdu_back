import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { 
  PositionUpdateRequestSchema, 
  PositionBindShopRequestSchema,
  PositionMarkRequestSchema,
} from '@/lib/schema/part'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string(),
})

// 更新铺位
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证路径参数
    const paramsResult = paramsSchema.safeParse(await params)
    if (!paramsResult.success) {
      return errorResponse('Invalid parameters', 400, paramsResult.error)
    }

    const body = await request.json()
    
    // 验证请求参数
    const requestResult = PositionUpdateRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { no } = requestResult.data

    // 检查铺位是否存在
    const existingPosition = await prisma.position.findUnique({
      where: { id: params.id },
    })

    if (!existingPosition) {
      return errorResponse('Position not found', 404)
    }

    // 检查铺位编号是否已被其他铺位使用
    const duplicatePosition = await prisma.position.findFirst({
      where: {
        position_no: no,
        id: { not: params.id },
      },
    })

    if (duplicatePosition) {
      return errorResponse('Position number already exists', 400)
    }

    // 更新铺位
    const position = await prisma.position.update({
      where: { id: params.id },
      data: { position_no: no },
    })

    return successResponse({
      id: position.id,
      position_no: position.position_no,
    })
  } catch (error) {
    console.error('Error updating position:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 绑定商家
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证路径参数
    const paramsResult = paramsSchema.safeParse(await params)
    if (!paramsResult.success) {
      return errorResponse('Invalid parameters', 400, paramsResult.error)
    }

    const body = await request.json()
    
    // 验证请求参数
    const requestResult = PositionBindShopRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { shopId } = requestResult.data

    // 检查铺位是否存在
    const position = await prisma.position.findUnique({
      where: { id: params.id },
    })

    if (!position) {
      return errorResponse('Position not found', 404)
    }

    // 检查商家是否存在
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    })

    if (!shop) {
      return errorResponse('Shop not found', 404)
    }

    // 绑定商家
    await prisma.position.update({
      where: { id: params.id },
      data: { shopId },
    })

    return successResponse({
      message: 'Shop bound successfully',
    })
  } catch (error) {
    console.error('Error binding shop:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 标记铺位
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证路径参数
    const paramsResult = paramsSchema.safeParse(await params)
    if (!paramsResult.success) {
      return errorResponse('Invalid parameters', 400, paramsResult.error)
    }

    const body = await request.json()
    
    // 验证请求参数
    const requestResult = PositionMarkRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { remark } = requestResult.data

    // 检查铺位是否存在
    const position = await prisma.position.findUnique({
      where: { id: params.id },
    })

    if (!position) {
      return errorResponse('Position not found', 404)
    }

    // 更新标记
    await prisma.position.update({
      where: { id: params.id },
      data: { remark },
    })

    return successResponse({
      message: 'Position marked successfully',
    })
  } catch (error) {
    console.error('Error marking position:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 获取铺位详情
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

    const position = await prisma.position.findUnique({
      where: { id: params.id },
      include: {
        shop: {
          select: {
            id: true,
            shop_no: true,
          },
        },
      },
    })

    if (!position) {
      return errorResponse('Position not found', 404)
    }

    // 转换数据格式
    const response = {
      positionId: position.id,
      position_no: position.position_no,
      shopId: position.shop?.id || null,
      shop_no: position.shop?.shop_no || null,
      total_space: position.total_space,
      put_space: position.put_space,
      price_base: position.price_base,
      verified: position.verified,
      displayed: position.displayed,
      type: position.type,
      type_tag: position.type_tag,
      photo: position.photo,
      remark: position.remark,
      business_hours: position.business_hours,
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching position:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 删除铺位
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

    const position = await prisma.position.findUnique({
      where: { id: params.id },
      include: {
        shop: true,
      },
    })

    if (!position) {
      return errorResponse('Position not found', 404)
    }

    // 检查是否有关联的商家
    if (position.shop) {
      return errorResponse('Cannot delete position with associated shop', 400)
    }

    // 删除铺位
    await prisma.position.delete({
      where: { id: params.id },
    })

    return successResponse({
      message: 'Position deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting position:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 
