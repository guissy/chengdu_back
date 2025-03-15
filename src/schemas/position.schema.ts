import { z } from 'zod';

// 铺位列表请求模式
export const positionListSchema = z.object({
  partId: z.string().optional().describe('分区ID'),
});
// 铺位详情请求模式
export const positionDetailSchema = z.object({
  id: z.string().describe('铺位ID'),
});

// 新增铺位请求模式
export const positionAddSchema = z.object({
  cbdId: z.string().describe('商圈ID'),
  partId: z.string().describe('分区ID'),
  no: z.string().min(1).describe('铺位编号'),
});

// 编辑铺位请求模式
export const positionUpdateSchema = z.object({
  id: z.string().describe('铺位ID'),
  no: z.string().min(1).describe('铺位编号'),
});

// 删除铺位请求模式
export const positionDeleteSchema = z.object({
  id: z.string().describe('铺位ID'),
});

// 置为空铺请求模式
export const positionSetEmptySchema = z.object({
  id: z.string().describe('铺位ID'),
});

// 关联新商家请求模式
export const positionBindShopSchema = z.object({
  id: z.string().describe('铺位ID'),
  shopId: z.string().describe('商家ID'),
});

// 快速标记铺位请求模式
export const positionMarkSchema = z.object({
  id: z.string().describe('铺位ID'),
  remark: z.string().describe('标记内容'),
});


// 铺位返回模式
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

// 铺位列表返回模式
export const positionListResponseSchema = z.object({
  list: z.array(positionResponseSchema),
});

// 通用响应模式
export const positionGenericResponseSchema = z.object({
  code: z.number(),
  data: z.any(),
});

// 类型定义
export type PositionListRequest = z.infer<typeof positionListSchema>;
export type PositionDetailRequest = z.infer<typeof positionDetailSchema>;
export type PositionAddRequest = z.infer<typeof positionAddSchema>;
export type PositionUpdateRequest = z.infer<typeof positionUpdateSchema>;
export type PositionDeleteRequest = z.infer<typeof positionDeleteSchema>;
export type PositionSetEmptyRequest = z.infer<typeof positionSetEmptySchema>;
export type PositionBindShopRequest = z.infer<typeof positionBindShopSchema>;
export type PositionMarkRequest = z.infer<typeof positionMarkSchema>;
export type PositionResponse = z.infer<typeof positionResponseSchema>;
export type PositionListResponse = z.infer<typeof positionListResponseSchema>;
export type PositionDetailResponse = z.infer<typeof positionResponseSchema>;
