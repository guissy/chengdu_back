import { z } from 'zod';

// 区域列表请求模式
export const districtListSchema = z.object({
  parentId: z.string().describe('城市ID'),
});

// 区域返回模式
export const districtResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// 区域列表返回模式
export const districtListResponseSchema = z.object({
  list: z.array(districtResponseSchema),
});

// 类型定义
export type DistrictListRequest = z.infer<typeof districtListSchema>;
export type DistrictResponse = z.infer<typeof districtResponseSchema>;
export type DistrictListResponse = z.infer<typeof districtListResponseSchema>;
