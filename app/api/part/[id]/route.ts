import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { PartUpdateRequestSchema } from '@/lib/schema/part'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string(),
})

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
    const requestResult = PartUpdateRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { name } = requestResult.data

    // 检查分区是否存在
    const existingPart = await prisma.part.findUnique({
      where: { id: params.id },
    })

    if (!existingPart) {
      return errorResponse('Part not found', 404)
    }

    // 更新分区
    const part = await prisma.part.update({
      where: { id: params.id },
      data: { name },
    })

    return successResponse({
      id: part.id,
      name: part.name,
      sequence: part.sequence,
    })
  } catch (error) {
    console.error('Error updating part:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 获取分区详情
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

    const part = await prisma.part.findUnique({
      where: { id: params.id },
      include: {
        positions: {
          select: {
            id: true,
            position_no: true,
            total_space: true,
            put_space: true,
            price_base: true,
            verified: true,
            displayed: true,
            type: true,
            type_tag: true,
            photo: true,
            remark: true,
            business_hours: true,
            shop: {
              select: {
                id: true,
                shop_no: true,
              },
            },
          },
        },
      },
    })

    if (!part) {
      return errorResponse('Part not found', 404)
    }

    // 转换数据格式
    const response = {
      ...part,
      positions: part.positions.map(pos => ({
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
      })),
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching part:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

// 删除分区
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

    const part = await prisma.part.findUnique({
      where: { id: params.id },
      include: {
        positions: true,
      },
    })

    if (!part) {
      return errorResponse('Part not found', 404)
    }

    // 检查是否有关联的铺位
    if (part.positions.length > 0) {
      return errorResponse('Cannot delete part with associated positions', 400)
    }

    // 删除分区
    await prisma.part.delete({
      where: { id: params.id },
    })

    return successResponse({
      message: 'Part deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting part:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 