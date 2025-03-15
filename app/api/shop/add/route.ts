import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { shopAddSchema } from '@/app/lib/schemas/shop'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = shopAddSchema.parse(body)
    
    const {
      cbdId,
      partId,
      positionId,
      type,
      type_tag,
      business_type,
      trademark,
      branch,
      location,
      verified,
      duration,
      consume_display,
      average_expense,
      sex,
      age,
      id_tag,
      sign_photo,
      verify_photo,
      environment_photo,
      building_photo,
      brand_photo,
      contact_name,
      contact_phone,
      contact_type,
      total_area,
      customer_area,
      clerk_count,
      business_hours,
      rest_days,
      volume_peak,
      season,
      shop_description,
      put_description,
      displayed,
      price_base,
      classify_tag,
      remark,
    } = validatedData

    // 验证商圈存在
    const existingCbd = await prisma.cBD.findUnique({
      where: { id: cbdId },
    })

    if (!existingCbd) {
      return NextResponse.json(
        { code: 404, message: '商圈不存在' },
        { status: 404 }
      )
    }

    // 验证分区存在
    const existingPart = await prisma.part.findUnique({
      where: { id: partId },
    })

    if (!existingPart) {
      return NextResponse.json(
        { code: 404, message: '分区不存在' },
        { status: 404 }
      )
    }

    // 验证铺位存在
    if (positionId) {
      const existingPosition = await prisma.position.findUnique({
        where: { id: positionId },
      })

      if (!existingPosition) {
        return NextResponse.json(
          { code: 404, message: '铺位不存在' },
          { status: 404 }
        )
      }

      // 验证铺位是否已被占用
      if (existingPosition.shopId) {
        return NextResponse.json(
          { code: 400, message: '铺位已被占用' },
          { status: 400 }
        )
      }
    }

    // 生成商家编号
    const shopCount = await prisma.shop.count()
    const shop_no = `SH${(shopCount + 1).toString().padStart(5, '0')}`

    // 创建商家
    const newShop = await prisma.shop.create({
      data: {
        shop_no,
        cbdId,
        partId,
        type,
        type_tag,
        business_type,
        trademark,
        branch,
        location,
        verified: verified || false,
        duration,
        consume_display: consume_display || true,
        average_expense,
        sex,
        age,
        id_tag,
        sign_photo,
        verify_photo: verify_photo || [],
        environment_photo,
        building_photo,
        brand_photo,
        contact_name,
        contact_phone,
        contact_type,
        total_area,
        customer_area,
        clerk_count,
        business_hours,
        rest_days,
        volume_peak,
        season,
        shop_description,
        put_description,
        displayed,
        price_base,
        classify_tag,
        remark,
      },
    })

    return NextResponse.json({
      code: 200,
      data: {
        id: newShop.id,
      },
    })
  } catch (error) {
    console.error('Error creating shop:', error)
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