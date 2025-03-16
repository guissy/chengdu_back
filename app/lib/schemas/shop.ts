import { z } from 'zod'

// 商家返回模式
export const shopResponseSchema = z.object({
  shopId: z.string(),
  shop_no: z.string().optional(),
  trademark: z.string(),
  branch: z.string().nullable(),
  total_space: z.number(),
  put_space: z.number(),
  price_base: z.number(),
  verified: z.boolean(),
  displayed: z.boolean(),
  type: z.string(),
  type_tag: z.string().nullable(),
  photo: z.array(z.string()),
  remark: z.string().nullable(),
  business_hours: z.array(z.number()),
  total_area: z.number().nullable(),
  customer_area: z.number().nullable(),
  clerk_count: z.number().nullable(),
  business_type: z.string(),
  duration: z.string(),
  sex: z.string(),
  age: z.array(z.number()),
  id_tag: z.string().nullable(),
  sign_photo: z.string().nullable(),
  contact_type: z.string()
});

// 商家列表返回模式
export const shopListResponseSchema = z.object({
  list: z.array(shopResponseSchema),
});

export const shopDetailSchema = z.object({
  id: z.number(),
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
