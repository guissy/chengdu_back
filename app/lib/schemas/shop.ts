import { z } from 'zod'

export const shopListResponseSchema = z.object({
  list: z.array(
    z.object({
      id: z.number(),
      shopId: z.number(),
      shop_no: z.string(),
      trademark: z.string(),
      branch: z.string().nullable(),
      location: z.string(),
      total_space: z.number(),
      put_space: z.number(),
      photo: z.array(z.string()),
    })
  ),
})

export const shopDetailSchema = z.object({
  id: z.number(),
})

export const shopResponseSchema = z.object({
  id: z.number(),
  shopId: z.number(),
  shop_no: z.string(),
  trademark: z.string(),
  branch: z.string().nullable(),
  location: z.string(),
  total_space: z.number(),
  put_space: z.number(),
  photo: z.array(z.string()),
  // ... 其他字段根据需要添加
})

export const shopAddSchema = z.object({
  cbdId: z.string(),
  partId: z.string(),
  positionId: z.string().optional(),
  type: z.string(),
  type_tag: z.array(z.string()),
  business_type: z.string(),
  trademark: z.string(),
  branch: z.string().nullable(),
  location: z.string(),
  verified: z.boolean().optional(),
  duration: z.string(),
  consume_display: z.boolean().optional(),
  average_expense: z.number(),
  sex: z.string(),
  age: z.array(z.string()),
  id_tag: z.array(z.string()),
  sign_photo: z.array(z.string()),
  verify_photo: z.array(z.string()).optional(),
  environment_photo: z.array(z.string()),
  building_photo: z.array(z.string()),
  brand_photo: z.array(z.string()),
  contact_name: z.string(),
  contact_phone: z.string(),
  contact_type: z.string(),
  total_area: z.number(),
  customer_area: z.number(),
  clerk_count: z.number(),
  business_hours: z.array(z.string()),
  rest_days: z.array(z.string()),
  volume_peak: z.array(z.string()),
  season: z.array(z.string()),
  shop_description: z.string(),
  put_description: z.string(),
  displayed: z.boolean(),
  price_base: z.number(),
  classify_tag: z.array(z.string()),
  remark: z.string().nullable(),
})

export const shopUpdateSchema = shopAddSchema.extend({
  id: z.string(),
})

export const shopDeleteSchema = z.object({
  id: z.string(),
})
