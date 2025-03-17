import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { PartAddRequestSchema } from '@/lib/schema/part'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求参数
    const requestResult = PartAddRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

    const { cbdId, name, sequence } = requestResult.data

    // 检查商圈是否存在
    const cbd = await prisma.cBD.findUnique({
      where: { id: cbdId },
    })

    if (!cbd) {
      return errorResponse('CBD not found', 404)
    }

    // 创建分区
    const part = await prisma.part.create({
      data: {
        cbdId,
        name,
        sequence,
      },
    })

    return successResponse({
      id: part.id,
      name: part.name,
      sequence: part.sequence,
    })
  } catch (error) {
    console.error('Error creating part:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 