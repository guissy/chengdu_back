import { z } from 'zod';

// 商家类型枚举
export const ShopTypeEnum = z.enum(['RESTAURANT', 'LIGHT_FOOD', 'TEA_HOUSE', 'TEA_COFFEE', 'COFFEE_SHOP', 'HOTEL']).describe('商家类型');

// 商业类型枚举
export const BusinessTypeEnum = z.enum(['INDEPENDENT', 'CHAIN_DIRECT', 'CHAIN_FRANCHISE']).describe('商业类型');

// 性别对象枚举
export const GenderEnum = z.enum(['ALL', 'MALE', 'FEMALE']).describe('性别');

// 联系人类型枚举
export const ContactTypeEnum = z.enum(['OWNER', 'MANAGER', 'STAFF', 'HEADQUARTERS']).describe('联系人类型');

// 经营时长枚举
export const OperationDurationEnum = z.enum(['LESS_THAN_ONE', 'ONE_TO_TWO', 'TWO_TO_FIVE', 'MORE_THAN_FIVE']).describe('经营时长');

// 休息日枚举
export const RestDayEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'ON_DEMAND']).describe('休息日');

// 客流高峰枚举
export const PeakTimeEnum = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT', 'MORNING', 'AFTERNOON', 'EVENING', 'MIDNIGHT']).describe('客流高峰');

// 季节枚举
export const SeasonEnum = z.enum(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'HOLIDAY', 'WORKDAY', 'NON_WORKDAY']).describe('季节');

// 广告位类型枚举
export const SpaceTypeEnum = z.enum(['TABLE_STICKER', 'TABLE_PLACEMAT', 'STAND', 'X_BANNER', 'TV_LED', 'PROJECTOR']).describe('广告位类型');

// 广告位状态枚举
export const SpaceStateEnum = z.enum(['ENABLED', 'DISABLED']).describe('广告位状态');

// 广告位位置枚举
export const SpaceSiteEnum = z.enum(['MAIN_AREA', 'SHOP_ENTRANCE', 'ENTRANCE_PASSAGE', 'PRIVATE_ROOM', 'TOILET_PASSAGE', 'TOILET', 'OUTDOOR_AREA', 'OUTSIDE_WALL', 'STREET_WALL']).describe('广告位位置');

// 广告位稳定性枚举
export const SpaceStabilityEnum = z.enum(['FIXED', 'SEMI_FIXED', 'MOVABLE', 'TEMPORARY']).describe('广告位稳定性');

// 操作类型枚举
export const OperationTypeEnum = z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('操作类型');

// 操作对象枚举
export const OperationTargetEnum = z.enum(['CBD', 'PART', 'POSITION', 'SHOP', 'SPACE', 'DASHBOARD']).describe('操作对象');
