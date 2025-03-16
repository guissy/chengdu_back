import { z } from 'zod';

// 物业小区列表请求模式
export const partListSchema = z.object({
  cbdId: z.string().optional().describe('商圈ID'),
});

// 物业小区详情请求模式
export const partDetailSchema = z.object({
  id: z.string().describe('分区ID'),
});

// 新增分区请求模式
export const partAddSchema = z.object({
  cbdId: z.string().describe('商圈ID'),
  name: z.string().min(1).describe('分区名称'),
  sequence: z.number().int().positive().describe('排序值'),
});

// 编辑分区请求模式
export const partUpdateSchema = z.object({
  id: z.string().describe('分区ID'),
  name: z.string().min(1).describe('分区名称'),
});

// 删除分区请求模式
export const partDeleteSchema = z.object({
  id: z.string().describe('分区ID'),
});

// 分区返回模式
export const partResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sequence: z.number(),
  total_space: z.number(),
});

// 分区列表返回模式
export const partListResponseSchema = z.object({
  list: z.array(partResponseSchema),
});

// 通用响应模式
export const partGenericResponseSchema = z.object({
  code: z.number(),
  data: z.any(),
});

// 类型定义
export type PartListRequest = z.infer<typeof partListSchema>;
export type PartListResponse = z.infer<typeof partListResponseSchema>;
export type PartDetailRequest = z.infer<typeof partDetailSchema>;
export type PartDetailResponse = z.infer<typeof partResponseSchema>;
export type PartAddRequest = z.infer<typeof partAddSchema>;
export type PartUpdateRequest = z.infer<typeof partUpdateSchema>;
export type PartDeleteRequest = z.infer<typeof partDeleteSchema>;
export type PartResponse = z.infer<typeof partResponseSchema>;
export type PartGenericResponse = z.infer<typeof partGenericResponseSchema>;
