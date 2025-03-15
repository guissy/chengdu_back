import { z } from 'zod';

// 商圈列表请求模式
export const cbdListSchema = z.object({
  districtId: z.string().describe('行政区划ID'),
});

// 商圈返回模式
export const cbdResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  addr: z.string().nullable(),
});

// 商圈列表返回模式
export const cbdListResponseSchema = z.object({
  list: z.array(cbdResponseSchema),
});

// 类型定义
export type CbdListRequest = z.infer<typeof cbdListSchema>;
export type CbdResponse = z.infer<typeof cbdResponseSchema>;
export type CbdListResponse = z.infer<typeof cbdListResponseSchema>;
