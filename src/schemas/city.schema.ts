import { z } from 'zod';

// 城市返回模式
export const cityResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// 城市列表返回模式
export const cityListResponseSchema = z.object({
  list: z.array(cityResponseSchema),
});

// 类型定义
export type CityResponse = z.infer<typeof cityResponseSchema>;
export type CityListResponse = z.infer<typeof cityListResponseSchema>;
