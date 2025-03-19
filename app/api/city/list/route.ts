import { ResponseFactory } from '@/lib/api/response_pb'
import prisma from '@/lib/prisma'
import { CityListResponseSchema } from '@/lib/schema/location'
import { successResponse, errorResponse } from '@/lib/api/response';

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
      return ResponseFactory.error('Invalid response format', 500)
    }

    return successResponse(response);
    // return ResponseFactory.success(response, CityList)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
