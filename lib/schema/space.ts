import { z } from 'zod';
import { BaseResponseSchema } from './base';
import { SpaceTypeEnum, SpaceStateEnum, SpaceSiteEnum, SpaceStabilityEnum } from './enums';

// 广告位模型
export const SpaceSchema = z.object({
  id: z.string(),
  shopId: z.string().describe('商家id'),
  type: SpaceTypeEnum.describe('广告位类型'),
  setting: z.record(z.unknown()).describe('广告位设置'),
  count: z.number().default(1).describe('广告位数量'),
  state: SpaceStateEnum.default('ENABLED').describe('状态'),
  price_factor: z.number().default(1.0).describe('价格因子'),
  tag: z.string().nullable().describe('分类标签'),
  site: SpaceSiteEnum.nullable().describe('位置'),
  stability: SpaceStabilityEnum.nullable().describe('稳定性'),
  photo: z.array(z.string()).describe('相册'),
  description: z.string().nullable().describe('投放推介'),
  design_attention: z.string().nullable().describe('设计注意事项'),
  construction_attention: z.string().nullable().describe('施工注意事项'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 广告位列表请求
export const SpaceListRequestSchema = z.object({
  shopId: z.string().describe('商家ID'),
});

// 广告位列表响应
export const SpaceListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    list: z.array(z.object({
      id: z.string(),
      type: z.string(),
      setting: z.record(z.unknown()),
      count: z.number(),
      state: z.string(),
      price_factor: z.number(),
      updatedAt: z.string(),
      shopId: z.string(),
      shop: z.object({
        trademark: z.string().optional(),
        shop_no: z.string().optional(),
        branch: z.string().optional(),
        type_tag: z.string().optional(),
      }).optional(),
      tag: z.string().optional(),
      site: z.string().optional(),
      stability: z.string().optional(),
      photo: z.array(z.string()).optional(),
      description: z.string().optional(),
      design_attention: z.string().optional(),
      construction_attention: z.string().optional(),
    })),
  }).optional(),
});

// 广告位新增请求
export const SpaceAddRequestSchema = z.object({
  shopId: z.string().describe('商家ID'),
  type: z.string().describe('广告位类型'),
  setting: z.record(z.unknown()).describe('广告位设置'),
  count: z.number().optional().default(1).describe('广告位数量'),
  state: z.string().describe('状态'),
  price_factor: z.number().optional().default(1).describe('价格因子'),
  tag: z.string().optional().describe('分类标签'),
  site: z.string().optional().describe('位置'),
  stability: z.string().optional().describe('稳定性'),
  photo: z.array(z.string()).optional().describe('相册'),
  description: z.string().optional().describe('投放推介'),
  design_attention: z.string().optional().describe('设计注意事项'),
  construction_attention: z.string().optional().describe('施工注意事项'),
});

// 广告位更新请求
export const SpaceUpdateRequestSchema = SpaceAddRequestSchema.extend({
  id: z.string().describe('广告位ID'),
});

// 广告位状态更新请求
export const SpaceStateUpdateRequestSchema = z.object({
  id: z.string().describe('广告位ID'),
  state: z.string().describe('状态'),
});