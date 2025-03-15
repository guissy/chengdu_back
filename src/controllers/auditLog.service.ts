import { FastifyInstance } from 'fastify';
import { Prisma, OperationType, OperationTarget } from '@prisma/client';

export class AuditLogService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 创建审计日志
   */
  async createLog({
                    operationType,
                    targetType,
                    targetId,
                    targetName,
                    content,
                    operatorId,
                    operatorName,
                    details = {},
                    request = null,
                  }: {
    operationType: OperationType;
    targetType: OperationTarget;
    targetId: string;
    targetName: string;
    content: string;
    operatorId: string;
    operatorName: string;
    details?: Record<string, any>;
    request?: any;
  }) {
    try {
      // 获取IP和UserAgent信息（如果可用）
      const ipAddress = request?.ip || null;
      const userAgent = request?.headers?.['user-agent'] || null;

      // 创建审计日志
      return await this.fastify.prisma.auditLog.create({
        data: {
          operationType,
          targetType,
          targetId,
          targetName,
          content,
          operatorId,
          operatorName,
          details,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      this.fastify.log.error('创建审计日志失败', error);
      // 不抛出异常，避免影响主要业务流程
      return null;
    }
  }

  /**
   * 记录新增操作
   */
  async logCreate({
                    targetType,
                    targetId,
                    targetName,
                    operatorId,
                    operatorName,
                    details = {},
                    request = null,
                  }: {
    targetType: OperationTarget;
    targetId: string;
    targetName: string;
    operatorId: string;
    operatorName: string;
    details?: Record<string, any>;
    request?: any;
  }) {
    // 根据不同对象类型生成不同的操作内容
    let content = '';
    switch (targetType) {
      case 'CBD':
        content = `添加了商圈"${targetName}"`;
        break;
      case 'PART':
        content = `添加了物业小区"${targetName}"`;
        break;
      case 'POSITION':
        content = `添加了铺位"${targetName}"`;
        break;
      case 'SHOP':
        content = `添加了商家"${targetName}"`;
        break;
      case 'SPACE':
        content = `添加了广告位"${targetName}"`;
        break;
      case 'CAMPAIGN':
        content = `添加了广告活动"${targetName}"`;
        break;
      default:
        content = `添加了${targetType}"${targetName}"`;
    }

    return this.createLog({
      operationType: 'CREATE',
      targetType,
      targetId,
      targetName,
      content,
      operatorId,
      operatorName,
      details,
      request,
    });
  }

  /**
   * 记录编辑操作
   */
  async logUpdate({
                    targetType,
                    targetId,
                    targetName,
                    operatorId,
                    operatorName,
                    details = {},
                    request = null,
                  }: {
    targetType: OperationTarget;
    targetId: string;
    targetName: string;
    operatorId: string;
    operatorName: string;
    details?: Record<string, any>;
    request?: any;
  }) {
    // 根据不同对象类型生成不同的操作内容
    let content = '';
    switch (targetType) {
      case 'CBD':
        content = `更新了商圈"${targetName}"的信息`;
        break;
      case 'PART':
        content = `更新了物业小区"${targetName}"的信息`;
        break;
      case 'POSITION':
        content = `更新了铺位"${targetName}"的信息`;
        break;
      case 'SHOP':
        content = `更新了商家"${targetName}"的信息`;
        break;
      case 'SPACE':
        content = `更新了广告位"${targetName}"的信息`;
        break;
      case 'CAMPAIGN':
        content = `更新了广告活动"${targetName}"的信息`;
        break;
      default:
        content = `更新了${targetType}"${targetName}"的信息`;
    }

    return this.createLog({
      operationType: 'UPDATE',
      targetType,
      targetId,
      targetName,
      content,
      operatorId,
      operatorName,
      details,
      request,
    });
  }

  /**
   * 记录删除操作
   */
  async logDelete({
                    targetType,
                    targetId,
                    targetName,
                    operatorId,
                    operatorName,
                    details = {},
                    request = null,
                  }: {
    targetType: OperationTarget;
    targetId: string;
    targetName: string;
    operatorId: string;
    operatorName: string;
    details?: Record<string, any>;
    request?: any;
  }) {
    // 根据不同对象类型生成不同的操作内容
    let content = '';
    switch (targetType) {
      case 'CBD':
        content = `删除了商圈"${targetName}"`;
        break;
      case 'PART':
        content = `删除了物业小区"${targetName}"`;
        break;
      case 'POSITION':
        content = `删除了铺位"${targetName}"`;
        break;
      case 'SHOP':
        content = `删除了商家"${targetName}"`;
        break;
      case 'SPACE':
        content = `删除了广告位"${targetName}"`;
        break;
      case 'CAMPAIGN':
        content = `删除了广告活动"${targetName}"`;
        break;
      default:
        content = `删除了${targetType}"${targetName}"`;
    }

    return this.createLog({
      operationType: 'DELETE',
      targetType,
      targetId,
      targetName,
      content,
      operatorId,
      operatorName,
      details,
      request,
    });
  }

  /**
   * 记录对象变更前后的详细信息
   * @param oldData 变更前的数据
   * @param newData 变更后的数据
   * @returns 变更的字段及其前后值
   */
  static generateChangeDetails(oldData: Record<string, any>, newData: Record<string, any>) {
    const changes: Record<string, { old: any; new: any }> = {};

    // 遍历新数据中的所有键
    for (const key in newData) {
      // 跳过函数和内部字段
      if (
        typeof newData[key] === 'function' ||
        key.startsWith('_') ||
        key === 'updatedAt' ||
        key === 'createdAt'
      ) {
        continue;
      }

      // 如果字段值发生了变化，记录变更
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes[key] = {
          old: oldData[key],
          new: newData[key],
        };
      }
    }

    return changes;
  }
}
