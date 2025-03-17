import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import prisma from '@/lib/prisma'
import { ShopAddRequestSchema } from '@/lib/schema/shop'
import {
  ShopTypeEnum,
  BusinessTypeEnum,
  GenderEnum,
  ContactTypeEnum,
  OperationDurationEnum,
  RestDayEnum,
  PeakTimeEnum,
  SeasonEnum
} from '@/lib/schema/enums'
import { BusinessType, ContactType, RestDay, ShopType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求参数
    const requestResult = ShopAddRequestSchema.safeParse(body)
    if (!requestResult.success) {
      return errorResponse('Invalid parameters', 400, requestResult.error)
    }

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
      business_hours,
      rest_days,
      volume_peak,
      season,
      price_base,
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
      shop_description,
      put_description,
      displayed,
      classify_tag,
      remark,
    } = requestResult.data

    // 生成商铺编号
    const shop_no = `SHOP${Date.now()}`
    console.log(type, requestResult.data, 'ο▬▬▬▬▬▬▬▬◙▅▅▆▆▇▇◤')
    // 创建商铺
    const shop = await prisma.shop.create({
      data: {
        shop_no,
        // cbdId,
        // partId,
        type: type as ShopType,
        type_tag,
        business_type: business_type as BusinessType,
        trademark: trademark ?? '',
        branch,
        location,
        verified,
        duration,
        consume_display,
        average_expense,
        sex,
        age,
        business_hours,
        rest_days: rest_days as RestDay[],
        volume_peak,
        season,
        price_base,
        id_tag,
        sign_photo,
        verify_photo,
        environment_photo,
        building_photo,
        brand_photo,
        contact_name,
        contact_phone,
        contact_type: contact_type as ContactType,
        total_area,
        customer_area,
        clerk_count,
        shop_description,
        put_description,
        displayed,
        classify_tag,
        remark,
        ...(cbdId && { cbd: { connect: { id: cbdId } } }),
        ...(partId && { part: { connect: { id: partId } } }),
      },
    })

    // 如果提供了铺位ID，则关联铺位
    if (positionId) {
      await prisma.position.update({
        where: { id: positionId },
        data: { shopId: shop.id },
      })
    }

    return successResponse({
      id: shop.id,
      shop_no: shop.shop_no,
    })
  } catch (error) {
    console.error('Error creating shop:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
