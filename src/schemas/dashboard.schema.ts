import { z } from 'zod';


export const dashboardStatsSchema = z.object({
  cbdCount: z.number().int().nonnegative().describe('商圈总数'),
  partCount: z.number().int().nonnegative().describe('物业小区总数'),
  positionCount: z.number().int().nonnegative().describe('铺位总数'),
  shopCount: z.number().int().nonnegative().describe('商家总数'),
  spaceCount: z.number().int().nonnegative().describe('广告位总数'),
  campaignCount: z.number().int().nonnegative().describe('广告活动总数'),
});
