import { z } from 'zod';
import { BaseResponseSchema } from './base';
import { 
  ShopTypeEnum, 
  BusinessTypeEnum, 
  GenderEnum, 
  ContactTypeEnum,
  OperationDurationEnum,
  RestDayEnum,
  PeakTimeEnum,
  SeasonEnum
} from './enums';
import { 
  LocationSchema, 
  BusinessHoursSchema, 
  AgeRangeSchema, 
  ExpenseRangeSchema 
} from './base';

// 商家基础信息字段
const shopBaseFields = {
  type: ShopTypeEnum.describe('类型'),
  type_tag: z.string().nullable().describe('品类标签'),
  business_type: BusinessTypeEnum.describe('商业类型'),
  trademark: z.string().describe('字号'),
  branch: z.string().nullable().describe('分店'),
  verified: z.boolean().default(false).describe('是否认证'),
  displayed: z.boolean().default(true).describe('是否开放'),
  price_base: z.number().describe('价格基数（单位：分）'),
} as const;

// 商家详细信息字段
const shopDetailFields = {
  duration: OperationDurationEnum.describe('经营时长'),
  consume_display: z.boolean().default(true).describe('是否展示消费数据'),
  average_expense: ExpenseRangeSchema,
  sex: GenderEnum.default('ALL').describe('性别'),
  age: AgeRangeSchema,
  id_tag: z.string().nullable().describe('身份标签'),
  total_area: z.number().nullable().describe('面积，单位(平方米)'),
  customer_area: z.number().nullable().describe('客区面积'),
  clerk_count: z.number().nullable().describe('店员人数'),
  business_hours: BusinessHoursSchema,
  rest_days: z.array(RestDayEnum).describe('休息日'),
  volume_peak: z.array(PeakTimeEnum).describe('客流高峰'),
  season: z.array(SeasonEnum).describe('季节'),
} as const;

// 商家图片字段
const shopPhotoFields = {
  sign_photo: z.string().nullable().describe('标识图片'),
  verify_photo: z.array(z.string()).describe('认证图片'),
  environment_photo: z.array(z.string()).describe('外景图片'),
  building_photo: z.array(z.string()).describe('内景图片'),
  brand_photo: z.array(z.string()).describe('品牌营销图片'),
} as const;

// 商家联系人字段
const shopContactFields = {
  contact_name: z.string().nullable().describe('联系人姓名'),
  contact_phone: z.string().nullable().describe('联系人电话'),
  contact_type: ContactTypeEnum.nullable().describe('联系人类型'),
} as const;

// 商家描述字段
const shopDescriptionFields = {
  shop_description: z.string().nullable().describe('商家简介'),
  put_description: z.string().nullable().describe('投放简介'),
  classify_tag: z.string().nullable().describe('分类标签'),
  remark: z.string().nullable().describe('备注'),
} as const;

// 商家模型
export const ShopSchema = z.object({
  id: z.string(),
  shop_no: z.string().describe('商家编号'),
  cbdId: z.string().describe('商圈id'),
  partId: z.string().describe('分区id'),
  location: LocationSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  ...shopBaseFields,
  ...shopDetailFields,
  ...shopPhotoFields,
  ...shopContactFields,
  ...shopDescriptionFields,
});

// 商家列表响应
export const ShopListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    list: z.array(z.object({
      shopId: z.string(),
      shop_no: z.string().optional(),
      positionId: z.string().optional(),
      position_no: z.string().optional(),
      total_space: z.number(),
      put_space: z.number(),
      photo: z.array(z.string()),
      ...shopBaseFields,
      ...shopDetailFields,
      ...shopContactFields,
      ...shopDescriptionFields,
    })),
  }).optional(),
});

// 商家新增/更新请求基础字段
const shopRequestBaseFields = {
  type: z.string().describe('类型'),
  type_tag: z.string().optional().describe('品类标签'),
  business_type: z.string().describe('商业类型'),
  trademark: z.string().describe('字号'),
  branch: z.string().optional().describe('分店'),
  location: z.tuple([z.number(), z.number()]).describe('坐标，经纬度'),
  verified: z.boolean().optional().default(false).describe('是否认证'),
  duration: z.string().describe('经营时长'),
  consume_display: z.boolean().optional().default(true).describe('是否展示消费数据'),
  average_expense: z.tuple([z.number(), z.number()]).describe('人均消费最低到最高值，单位(分)'),
  sex: z.string().describe('性别'),
  age: z.tuple([z.number(), z.number()]).describe('年龄段最低到最高值'),
  business_hours: z.tuple([z.number(), z.number()]).describe('营业时间'),
  rest_days: z.array(z.string()).describe('休息日'),
  volume_peak: z.array(z.string()).describe('客流高峰'),
  season: z.array(z.string()).describe('季节'),
  price_base: z.number().describe('价格基数（单位：分）'),
} as const;

// 商家新增/更新请求可选字段
const shopRequestOptionalFields = {
  id_tag: z.string().optional().describe('身份标签'),
  sign_photo: z.string().optional().describe('标识图片'),
  verify_photo: z.array(z.string()).optional().describe('认证图片'),
  environment_photo: z.array(z.string()).optional().describe('外景图片'),
  building_photo: z.array(z.string()).optional().describe('内景图片'),
  brand_photo: z.array(z.string()).optional().describe('品牌营销图片'),
  contact_name: z.string().optional().describe('联系人姓名'),
  contact_phone: z.string().optional().describe('联系人电话'),
  contact_type: z.string().optional().describe('联系人类型'),
  total_area: z.number().optional().describe('面积，单位(平方米)'),
  customer_area: z.number().optional().describe('客区面积'),
  clerk_count: z.number().optional().describe('店员人数'),
  shop_description: z.string().optional().describe('商家简介'),
  put_description: z.string().optional().describe('投放简介'),
  displayed: z.boolean().optional().default(true).describe('是否开放'),
  classify_tag: z.string().optional().describe('分类标签'),
  remark: z.string().optional().describe('备注'),
} as const;

// 商家新增请求
export const ShopAddRequestSchema = z.object({
  cbdId: z.string().describe('商圈ID'),
  partId: z.string().describe('分区ID'),
  positionId: z.string().optional().describe('铺位ID'),
  ...shopRequestBaseFields,
  ...shopRequestOptionalFields,
});

// 商家更新请求
export const ShopUpdateRequestSchema = z.object({
  id: z.string().describe('商家ID'),
  ...shopRequestBaseFields,
  ...shopRequestOptionalFields,
});