import { z } from 'zod';
import { BaseResponseSchema } from './base';
import { ShopTypeEnum } from './enums';

// 分区模型
export const PartSchema = z.object({
  id: z.string(),
  name: z.string().describe('分区名称'),
  sequence: z.number().describe('排序值'),
  cbdId: z.string().describe('商圈id'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 分区列表请求
export const PartListRequestSchema = z.object({
  cbdId: z.string().optional().describe('商圈ID'),
});

// 分区列表响应
export const PartListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    list: z.array(z.object({
      id: z.string(),
      name: z.string(),
      sequence: z.number(),
      total_space: z.number(),
    })),
  }).optional(),
});

// 分区新增请求
export const PartAddRequestSchema = z.object({
  cbdId: z.string().describe('商圈ID'),
  name: z.string().describe('分区名称'),
  sequence: z.number().describe('排序值'),
});

// 分区更新请求
export const PartUpdateRequestSchema = z.object({
  id: z.string().describe('分区ID'),
  name: z.string().describe('分区名称'),
});

// 铺位模型
export const PositionSchema = z.object({
  id: z.string(),
  position_no: z.string().describe('铺位编号'),
  partId: z.string().describe('分区id'),
  total_space: z.number().default(0).describe('广告位总数'),
  put_space: z.number().default(0).describe('已投放广告位总数'),
  price_base: z.number().describe('价格基数（单位：分）'),
  verified: z.boolean().default(false).describe('是否认证'),
  displayed: z.boolean().default(true).describe('是否展示'),
  type: ShopTypeEnum.nullable().describe('类型'),
  type_tag: z.string().nullable().describe('品类标签'),
  photo: z.array(z.string()).describe('图片'),
  remark: z.string().nullable().describe('备注'),
  business_hours: z.array(z.number()).describe('营业时间'),
  shopId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 铺位列表请求
export const PositionListRequestSchema = z.object({
  partId: z.string().optional().describe('分区ID'),
});

// 铺位列表响应
export const PositionListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    list: z.array(z.object({
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
    })),
  }).optional(),
});

// 铺位新增请求
export const PositionAddRequestSchema = z.object({
  cbdId: z.string().describe('商圈ID'),
  partId: z.string().describe('分区ID'),
  no: z.string().describe('铺位编号'),
});

// 铺位更新请求
export const PositionUpdateRequestSchema = z.object({
  id: z.string().describe('铺位ID'),
  no: z.string().describe('铺位编号'),
});

// 铺位绑定商家请求
export const PositionBindShopRequestSchema = z.object({
  id: z.string().describe('铺位ID'),
  shopId: z.string().describe('商家ID'),
});

// 铺位标记请求
export const PositionMarkRequestSchema = z.object({
  id: z.string().describe('铺位ID'),
  remark: z.string().describe('标记内容'),
});