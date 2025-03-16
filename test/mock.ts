// src/test/mocks.ts
import { vi } from 'vitest';

/**
 * 为测试提供模拟响应数据
 */
export const mockResponses = {
  // 城市
  cities: {
    code: 200,
    data: {
      list: [
        { id: 'city1', name: '北京' },
        { id: 'city2', name: '上海' }
      ]
    }
  },

  // 区域
  districts: {
    code: 200,
    data: {
      list: [
        { id: 'district1', name: '朝阳区' },
        { id: 'district2', name: '海淀区' }
      ]
    }
  },

  // 商圈
  cbds: {
    code: 200,
    data: {
      list: [
        { id: 'cbd1', name: '三里屯', addr: '三里屯商圈' },
        { id: 'cbd2', name: '国贸', addr: '国贸商圈' }
      ]
    }
  },

  // 物业小区
  parts: {
    code: 200,
    data: {
      list: [
        { id: 'part1', name: '太古里', sequence: 1, total_space: 50 },
        { id: 'part2', name: '颐堤港', sequence: 2, total_space: 30 }
      ]
    }
  },

  partDetail: {
    code: 200,
    data: {
      id: 'part1',
      name: '太古里',
      sequence: 1,
      total_space: 50
    }
  },

  // 铺位
  positions: {
    code: 200,
    data: {
      list: [
        {
          positionId: 'position1',
          position_no: 'A-101',
          shopId: 'shop1',
          shop_no: 'S001',
          total_space: 5,
          put_space: 3,
          price_base: 10000,
          verified: true,
          displayed: true,
          type: '1',
          type_tag: '餐饮',
          photo: ['url1', 'url2'],
          remark: '临街铺位',
          business_hours: [9, 21]
        },
        {
          positionId: 'position2',
          position_no: 'A-102',
          shopId: null,
          shop_no: null,
          total_space: 4,
          put_space: 0,
          price_base: 8000,
          verified: false,
          displayed: true,
          type: null,
          type_tag: null,
          photo: [],
          remark: null,
          business_hours: [10, 22]
        }
      ]
    }
  },

  positionDetail: {
    code: 200,
    data: {
      positionId: 'position1',
      position_no: 'A-101',
      shopId: 'shop1',
      shop_no: 'S001',
      total_space: 5,
      put_space: 3,
      price_base: 10000,
      verified: true,
      displayed: true,
      type: '1',
      type_tag: '餐饮',
      photo: ['url1', 'url2'],
      remark: '临街铺位',
      business_hours: [9, 21]
    }
  },

  // 商家
  shops: {
    code: 200,
    data: {
      list: [
        {
          shopId: 'shop1',
          shop_no: 'S001',
          trademark: '星巴克',
          branch: '太古里店',
          total_space: 5,
          put_space: 3,
          price_base: 10000,
          verified: true,
          displayed: true,
          type: '5',
          type_tag: '咖啡馆',
          photo: ['url1', 'url2'],
          remark: '高端咖啡',
          business_hours: [8, 22],
          total_area: 120,
          customer_area: 80,
          clerk_count: 8,
          business_type: '2',
          duration: '4',
          sex: '1',
          age: [18, 45],
          id_tag: '白领',
          sign_photo: 'sign.jpg',
          contact_type: '2'
        }
      ]
    }
  },

  shopDetail: {
    code: 200,
    data: {
      shopId: 'shop1',
      shop_no: 'S001',
      trademark: '星巴克',
      branch: '太古里店',
      total_space: 5,
      put_space: 3,
      price_base: 10000,
      verified: true,
      displayed: true,
      type: '5',
      type_tag: '咖啡馆',
      photo: ['url1', 'url2'],
      remark: '高端咖啡',
      business_hours: [8, 22],
      total_area: 120,
      customer_area: 80,
      clerk_count: 8,
      business_type: '2',
      duration: '4',
      sex: '1',
      age: [18, 45],
      id_tag: '白领',
      sign_photo: 'sign.jpg',
      contact_type: '2'
    }
  },

  // 广告位
  spaces: {
    code: 200,
    data: {
      list: [
        {
          id: 'space1',
          type: '1',
          setting: { size: '10x10cm' },
          count: 5,
          state: '1',
          photo: ['url1', 'url2'],
          price_factor: 1.2,
          updatedAt: '2025-03-15T10:30:00Z',
          shopId: 'shop1',
          shop: {
            trademark: '星巴克',
            shop_no: 'S001'
          }
        }
      ]
    }
  },

  spaceDetail: {
    code: 200,
    data: {
      id: 'space1',
      type: '1',
      setting: { size: '10x10cm' },
      count: 5,
      state: '1',
      photo: ['url1', 'url2'],
      price_factor: 1.2,
      updatedAt: '2025-03-15T10:30:00Z',
      shopId: 'shop1',
      shop: {
        trademark: '星巴克',
        shop_no: 'S001'
      }
    }
  },

  // 仪表盘
  dashboard: {
    code: 200,
    data: {
      cbdCount: 15,
      partCount: 25,
      positionCount: 120,
      shopCount: 80,
      spaceCount: 150,
      campaignCount: 30
    }
  },

  recentShops: {
    code: 200,
    data: [
      {
        id: 'shop1',
        shop_no: 'S001',
        trademark: '星巴克',
        branch: '太古里店',
        type: '5',
        type_tag: '咖啡馆',
        business_type: '2',
        verify_status: true,
        cbd: {
          id: 'cbd1',
          name: '三里屯'
        },
        part: {
          id: 'part1',
          name: '太古里'
        },
        createdAt: '2025-03-15T10:30:00Z'
      },
      {
        id: 'shop2',
        shop_no: 'S002',
        trademark: '奈雪的茶',
        branch: '国贸店',
        type: '4',
        type_tag: '茶饮',
        business_type: '2',
        verify_status: true,
        cbd: {
          id: 'cbd2',
          name: '国贸'
        },
        part: {
          id: 'part2',
          name: '颐堤港'
        },
        createdAt: '2025-03-14T16:45:00Z'
      }
    ]
  },

  cbdDistribution: {
    code: 200,
    data: [
      {
        id: 'cbd1',
        name: '三里屯',
        district: '朝阳区',
        shopCount: 45,
        partCount: 12
      },
      {
        id: 'cbd2',
        name: '国贸',
        district: '朝阳区',
        shopCount: 35,
        partCount: 8
      }
    ]
  },

  shopTypeDistribution: {
    code: 200,
    data: [
      { type: '1', count: 30 }, // 餐饮
      { type: '4', count: 25 }, // 茶饮/咖啡
      { type: '5', count: 15 }  // 咖啡馆
    ]
  },

  // 审计日志
  auditLogs: {
    code: 200,
    data: {
      items: [
        {
          id: 'log1',
          operationType: 'create',
          targetType: 'shop',
          targetId: 'shop1',
          targetName: '星巴克',
          content: '创建商家',
          operatorId: 'user1',
          operatorName: '张三',
          operationTime: '2025-03-15T10:30:00Z',
          details: { field1: 'value1' },
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome'
        },
        {
          id: 'log2',
          operationType: 'update',
          targetType: 'position',
          targetId: 'position1',
          targetName: 'A-101',
          content: '编辑铺位',
          operatorId: 'user1',
          operatorName: '张三',
          operationTime: '2025-03-15T11:20:00Z',
          details: { field1: 'value1', field2: 'value2' },
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome'
        }
      ],
      total: 125,
      page: 1,
      pageSize: 10,
      totalPages: 13
    }
  },

  auditLogDetail: {
    code: 200,
    data: {
      id: 'log1',
      operationType: 'create',
      targetType: 'shop',
      targetId: 'shop1',
      targetName: '星巴克',
      content: '创建商家',
      operatorId: 'user1',
      operatorName: '张三',
      operationTime: '2025-03-15T10:30:00Z',
      details: {
        trademark: '星巴克',
        branch: '太古里店',
        type: '5',
        business_type: '2'
      },
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome'
    }
  },

  operationTypes: {
    code: 200,
    data: [
      { operationType: 'create', count: 45 },
      { operationType: 'update', count: 30 },
      { operationType: 'delete', count: 15 },
      { operationType: 'login', count: 35 }
    ]
  },

  recentActivity: {
    code: 200,
    data: [
      { date: '2025-03-15', count: 25 },
      { date: '2025-03-14', count: 18 },
      { date: '2025-03-13', count: 22 },
      { date: '2025-03-12', count: 15 },
      { date: '2025-03-11', count: 20 },
      { date: '2025-03-10', count: 12 },
      { date: '2025-03-09', count: 8 }
    ]
  },

  // 基础成功响应
  success: {
    code: 200,
    data: {}
  },

  // 新建成功带ID响应
  successWithId: {
    code: 200,
    data: {
      id: 'new-id-123'
    }
  }
};
