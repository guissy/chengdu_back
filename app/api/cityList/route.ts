import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

// 响应数据验证模式
const cityListResponseSchema = z.object({
  list: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
})

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    const response = {
      code: 200,
      data: {
        list: cities,
      },
    }

    // 验证响应数据
    cityListResponseSchema.parse(response.data)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching city list:', error)
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 