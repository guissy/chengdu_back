import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { CityListResponseSchema } from '@/lib/schema/location'

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    const response = {
      list: cities,
    }

    // 验证响应数据
    const result = CityListResponseSchema.safeParse({ data: response })
    if (!result.success) {
      return errorResponse('Invalid response format', 500, result.error)
    }

    return successResponse(response)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return errorResponse('Internal Server Error', 500)
  }
} 