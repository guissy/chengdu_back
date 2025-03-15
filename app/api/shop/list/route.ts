import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { shopListResponseSchema } from '@/app/lib/schemas/shop'

export async function GET() {
  try {
    // 查询数据库，找出所有商家
    const shops = await prisma.shop.findMany({
      include: {
        spaces: true,
      },
    })

    // 处理返回数据
    const formattedShops = shops.map((shop) => ({
      ...shop,
      shopId: shop.id,
      total_space: shop.spaces?.length ?? 0,
      put_space: shop.spaces?.filter((space) => space.state === "ENABLED").length ?? 0,
      photo: shop.environment_photo.concat(shop.building_photo),
    }))

    const response = {
      code: 200,
      data: {
        list: formattedShops,
      },
    }

    // 验证响应数据
    shopListResponseSchema.parse(response.data)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching shop list:', error)
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 