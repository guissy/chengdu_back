import { z } from 'zod';

// 查询参数验证Schema
export const auditLogQuerySchema = z.object({
  page: z.number().int().optional().default(1).transform(Number),
  pageSize: z.number().int().optional().default(10).transform(Number),
  operationType: z.string().optional(),
  targetType: z.string().optional(),
  operatorId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string().optional(),
});

// 审计日志响应Schema
export const auditLogResponseSchema = z.object({
  id: z.string(),
  operationType: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  targetName: z.string(),
  content: z.string(),
  operatorId: z.string(),
  operatorName: z.string(),
  operationTime: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
});

// 分页响应Schema
export const paginatedResponseSchema = z.object({
  items: z.array(auditLogResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
