import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { shopUpdateSchema } from '@/app/lib/schemas/shop'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = shopUpdateSchema.parse(body)
    
    const { id, ...updateData } = validatedData

    // 验证商家是否存在
    const existingShop = await prisma.shop.findUnique({
      where: { id },
    })

    if (!existingShop) {
      return NextResponse.json(
        { code: 404, message: '商家不存在' },
        { status: 404 }
      )
    }

    // 验证商圈存在
    const existingCbd = await prisma.cBD.findUnique({
      where: { id: updateData.cbdId },
    })

    if (!existingCbd) {
      return NextResponse.json(
        { code: 404, message: '商圈不存在' },
        { status: 404 }
      )
    }

    // 验证分区存在
    const existingPart = await prisma.part.findUnique({
      where: { id: updateData.partId },
    })

    if (!existingPart) {
      return NextResponse.json(
        { code: 404, message: '分区不存在' },
        { status: 404 }
      )
    }

    // 验证铺位存在
    if (updateData.positionId) {
      const existingPosition = await prisma.position.findUnique({
        where: { id: updateData.positionId },
      })

      if (!existingPosition) {
        return NextResponse.json(
          { code: 404, message: '铺位不存在' },
          { status: 404 }
        )
      }

      // 验证铺位是否已被占用（排除当前商家）
      if (existingPosition.shopId && existingPosition.shopId !== id) {
        return NextResponse.json(
          { code: 400, message: '铺位已被占用' },
          { status: 400 }
        )
      }
    }

    // 更新商家信息
    await prisma.shop.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      code: 200,
      data: null,
    })
  } catch (error) {
    console.error('Error updating shop:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { code: 400, message: '请求数据验证失败', errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 