import { z } from 'zod'

export const positionSchema = z.object({
  id: z.string(),
  name: z.string(),
  partId: z.string(),
  shopId: z.string().nullable(),
  state: z.enum(['ENABLED', 'DISABLED']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

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
  list: z.array(positionSchema),
})

export const positionResponseSchema = positionSchema 