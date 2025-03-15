import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { shopDeleteSchema } from '@/app/lib/schemas/shop'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = shopDeleteSchema.parse(body)
    
    const { id } = validatedData

    // 验证商家是否存在
    const existingShop = await prisma.shop.findUnique({
      where: { id },
      include: {
        spaces: true,
      },
    })

    if (!existingShop) {
      return NextResponse.json(
        { code: 404, message: '商家不存在' },
        { status: 404 }
      )
    }

    // 检查是否有关联的铺位
    if (existingShop.spaces && existingShop.spaces.length > 0) {
      return NextResponse.json(
        { code: 400, message: '该商家还有关联的铺位，无法删除' },
        { status: 400 }
      )
    }

    // 删除商家
    await prisma.shop.delete({
      where: { id },
    })

    return NextResponse.json({
      code: 200,
      data: null,
    })
  } catch (error) {
    console.error('Error deleting shop:', error)
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