// route.ts
import { CityListResponseSchema } from '@/lib/schema/location'
import prisma from '@/lib/prisma'

export async function GET() {
  // 创建编码器
  const encoder = new TextEncoder()

  // 创建一个流
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 发送初始响应 - 开始对象
        controller.enqueue(encoder.encode('{"code":200,"data":{"list":['))

        // 查询城市数据并流式传输
        const cities = await prisma.city.findMany({
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc',
          },
        })

        // 验证数据格式
        const validateData = { data: { list: cities } }
        const result = CityListResponseSchema.safeParse(validateData)
        if (!result.success) {
          // 如果验证失败，发送错误信息并关闭流
          controller.enqueue(
            encoder.encode(
              ']},"error":{"message":"Invalid response format","code":500}}'
            )
          )
          controller.close()
          return
        }
        let bigCity = cities.concat(cities).concat(cities).concat(cities).concat(cities).concat(cities);
        // bigCity = bigCity.concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity);
        // bigCity = bigCity.concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity);
        // bigCity = bigCity.concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity).concat(bigCity);
        bigCity = bigCity.concat(bigCity).concat(bigCity);//.concat(bigCity).concat(bigCity).concat(bigCity);
        
        // 流式传输每个城市
        for (let i = 0; i < bigCity.length; i++) {
          const city = bigCity[i]
          // 添加逗号分隔符，最后一项不需要
          const separator = i < bigCity.length - 1 ? ',' : ''
          controller.enqueue(encoder.encode(JSON.stringify(city) + separator))
          
          // 可选：添加小延迟模拟数据流（实际生产中可移除）
          await new Promise(resolve => setTimeout(resolve, 10))
        }

        // 发送结束部分
        controller.enqueue(encoder.encode(']}}'))
        controller.close()
      } catch (error) {
        console.error('Error streaming cities:', error)
        // 发送错误响应
        controller.enqueue(
          encoder.encode(
            ']},"error":{"message":"Internal Server Error","code":500}}'
          )
        )
        controller.close()
      }
    }
  })

  // 返回流响应
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}