import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { shopResponseSchema } from '@/app/lib/schemas/shop'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // 查询数据库，找出商家详情
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        spaces: true,
        position: true,
      },
    })

    if (!shop) {
      return NextResponse.json(
        { code: 404, message: '商家不存在' },
        { status: 404 }
      )
    }

    // 处理返回数据
    const formattedShop = {
      ...shop,
      shopId: shop.id,
      total_space: shop.spaces?.length ?? 0,
      put_space: shop.spaces?.filter((space) => space.state === "ENABLED").length ?? 0,
      photo: shop.environment_photo.concat(shop.building_photo),
    }

    const response = {
      code: 200,
      data: formattedShop,
    }

    // 验证响应数据
    shopResponseSchema.parse(response.data)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching shop detail:', error)
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 