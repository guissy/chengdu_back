import { z } from 'zod'

export const positionResponseSchema = z.object({
  positionId: z.string(),
  position_no: z.string(),
  shopId: z.string().nullable(),
  shop_no: z.string().nullable(),
  total_space: z.number(),
  put_space: z.number(),
  price_base: z.number(),
  verified: z.boolean(),
  displayed: z.boolean(),
  type: z.string().nullable(),
  type_tag: z.string().nullable(),
  photo: z.array(z.string()),
  remark: z.string().nullable(),
  business_hours: z.array(z.number()),
});

export const positionListSchema = z.object({
  partId: z.string(),
})

export const positionDetailSchema = z.object({
  id: z.string(),
})

export const positionAddSchema = z.object({
  name: z.string(),
  partId: z.string(),
  state: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
})

export const positionUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  partId: z.string(),
  state: z.enum(['ENABLED', 'DISABLED']),
})

export const positionDeleteSchema = z.object({
  id: z.string(),
})

export const positionSetEmptySchema = z.object({
  id: z.string(),
})

export const positionBindShopSchema = z.object({
  id: z.string(),
  shopId: z.string(),
})

export const positionMarkSchema = z.object({
  id: z.string(),
  state: z.enum(['ENABLED', 'DISABLED']),
})

export const positionListResponseSchema = z.object({
  list: z.array(positionResponseSchema),
})
