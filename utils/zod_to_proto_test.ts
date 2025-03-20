// 🔥 生成 Proto 文件
import { BaseResponseSchema, PaginationParamsSchema } from '@/lib/schema/base';
import { OperationTypeEnum, OperationTargetEnum } from '@/lib/schema/enums';
import {
  AuditLogDetailResponseSchema,
  AuditLogListRequestSchema,
  AuditLogListResponseSchema,
  AuditLogOperationTypeStatsResponseSchema, AuditLogRecentActivityStatsResponseSchema,
  AuditLogSchema
} from '@/lib/schema/audit';
import fs from 'node:fs';
import { zodToProto } from '@/utils/zod_to_proto';
import { CBDListResponseSchema, CityListResponseSchema, DistrictListResponseSchema } from '@/lib/schema/location';

const auditSchema = {
  BaseResponseSchema,
  PaginationParamsSchema,
  OperationTypeEnum,
  OperationTargetEnum,
  AuditLogSchema,
  AuditLogListRequestSchema,
  AuditLogListResponseSchema,
  AuditLogOperationTypeStatsResponseSchema,
  AuditLogRecentActivityStatsResponseSchema,
  AuditLogDetailResponseSchema,
}

const schema = {
  CBDListResponseSchema,
  DistrictListResponseSchema,
  CityListResponseSchema,
}

try {
  const protoDefinition1 = zodToProto(schema);
  fs.writeFileSync("/Users/zhonglvgui/Documents/h5/chengdu03/schemas/location.proto", protoDefinition1);
} catch (error) {
  console.error(error);
}
