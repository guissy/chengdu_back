import { z } from 'zod';
import { BaseResponseSchema, PaginationParamsSchema } from './base';
import { OperationTypeEnum, OperationTargetEnum } from './enums';

// 审计日志基础字段
const auditLogBaseFields = {
  operationType: OperationTypeEnum.describe('操作类型'),
  targetType: OperationTargetEnum.describe('操作对象类型'),
  targetId: z.string().describe('操作对象ID'),
  targetName: z.string().describe('操作对象名称'),
  content: z.string().describe('操作内容'),
  operatorId: z.string().describe('操作人ID'),
  operatorName: z.string().describe('操作人姓名'),
  operationTime: z.date().describe('操作时间'),
  details: z.record(z.unknown()).optional().describe('详细变更内容'),
  ipAddress: z.string().nullable().describe('IP地址'),
  userAgent: z.string().nullable().describe('用户代理信息'),
} as const;

// 审计日志模型
export const AuditLogSchema = z.object({
  id: z.string(),
  ...auditLogBaseFields,
});

// 审计日志列表请求
export const AuditLogListRequestSchema = PaginationParamsSchema.extend({
  operationType: z.string().optional().describe('操作类型筛选'),
  targetType: z.string().optional().describe('操作对象类型筛选'),
  operatorId: z.string().optional().describe('操作人ID筛选'),
  startDate: z.string().optional().describe('开始日期'),
  endDate: z.string().optional().describe('结束日期'),
  keyword: z.string().optional().describe('关键词搜索'),
});

// 审计日志列表响应
export const AuditLogListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    items: z.array(z.object({
      id: z.string(),
      ...auditLogBaseFields,
      operationTime: z.string(), // API 返回的是字符串格式的时间
    })),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }).optional(),
});

// 审计日志统计基础字段
const auditLogStatsBaseFields = {
  operationType: z.string().optional(),
  count: z.number().optional(),
} as const;

// 操作类型统计响应
export const OperationTypeStatsResponseSchema = BaseResponseSchema.extend({
  data: z.array(z.object(auditLogStatsBaseFields)).optional(),
});

// 近期活动统计响应
export const RecentActivityStatsResponseSchema = BaseResponseSchema.extend({
  data: z.array(z.object({
    date: z.string().optional().describe('日期'),
    count: z.number().optional().describe('操作次数'),
  })).optional(),
});

// 审计日志详情响应
export const AuditLogDetailResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.string(),
    ...auditLogBaseFields,
    operationTime: z.string(), // API 返回的是字符串格式的时间
  }).optional(),
}); 