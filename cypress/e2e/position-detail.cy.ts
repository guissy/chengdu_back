describe('铺位详情页测试', () => {
  beforeEach(() => {
    // 访问铺位详情页
    cy.visit('/position/pos-001');

    // 模拟API响应
    cy.intercept('GET', '/api/position/pos-001', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: {
            id: 'pos-001',
            position_no: 'P001',
            shopId: null,
            shop_no: null,
            total_space: 5,
            put_space: 2,
            price_base: 10000,
            verified: true,
            displayed: true,
            type: 1,
            type_tag: '餐饮',
            remark: '这是一个测试铺位'
          }
        }
      }
    }).as('getPositionDetail');

    // 模拟广告位列表API响应
    cy.intercept('POST', '/api/space/list', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: [
            {
              id: 'space-001',
              type: 'TABLE_STICKER',
              count: 2,
              state: 'ENABLED',
              price_factor: 1.5
            },
            {
              id: 'space-002',
              type: 'STAND',
              count: 1,
              state: 'DISABLED',
              price_factor: 2.0
            }
          ]
        }
      }
    }).as('getSpaceList');
  });

  it('应该正确加载铺位详情页', () => {
    // 等待API请求完成
    cy.wait('@getPositionDetail').then((interception) => {
      const position = interception.response?.body.data;

      // 验证页面标题和返回按钮
      cy.contains('铺位详情').should('be.visible');
      cy.contains('button', '返回').should('be.visible');

      // 验证基本信息卡片
      cy.get('[data-cy="card-base"]').within(() => {
        cy.contains('h2', '基本信息').should('be.visible');
        cy.contains('label', '铺位编号').next('div').should('contain', 'P001');

        // 验证商家信息
        cy.contains('label', '商家').next('div').should('contain', '暂无');
      });

      // 验证详细信息卡片
      cy.contains('[data-cy="card-count"]', '统计信息').first().should('contain', '广告位总数');
    });
  });

  it('应该显示备注信息', () => {
    cy.wait('@getPositionDetail');

    // 验证备注信息
    cy.contains('备注信息').should('be.visible');
    cy.contains('这是一个测试铺位').should('be.visible');
  });

  it('应该显示广告位列表', () => {
    // 模拟铺位有关联商家的情况
    cy.intercept('GET', '/api/position/pos-001', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          id: 'pos-001',
          position_no: 'P001',
          shopId: 'shop-001',
          shop_no: 'SH001',
          total_space: 5,
          put_space: 2,
          price_base: 10000,
          verified: true,
          displayed: true
        }
      }
    }).as('getPositionWithShop');

    cy.visit('/position/pos-001');
    cy.wait('@getPositionWithShop');
    cy.wait('@getSpaceList');

    // 验证广告位列表
    cy.contains('h2', '广告位列表').should('be.visible');
    cy.contains('td', '方桌不干胶贴').should('be.visible');
    cy.contains('td', '2').should('be.visible');
    cy.contains('td', '启用').should('be.visible');
    // cy.contains('td', '×1.5').should('be.visible');

    cy.contains('td', '立牌').should('be.visible');
    cy.contains('td', '1').should('be.visible');
    cy.contains('td', '禁用').should('be.visible');
    // cy.contains('td', '×2.0').should('be.visible');
  });

  it('应该能够编辑铺位信息', () => {
    cy.wait('@getPositionDetail');

    // 点击编辑按钮
    cy.contains('button', '编辑').click();

    // 验证编辑对话框是否打开
    cy.contains('dialog', '编辑铺位').should('be.visible');

    // 模拟更新API响应
    cy.intercept('POST', '/api/position/update', {
      statusCode: 200,
      body: {
        code: 0,
        message: '更新成功'
      }
    }).as('updatePosition');

    // 提交表单
    cy.contains('button', '保存').click();

    // 验证API调用
    cy.wait('@updatePosition');
  });

  it('应该能够删除铺位', () => {
    cy.wait('@getPositionDetail');

    // 点击删除按钮
    cy.contains('button', '删除').click();

    // 验证删除对话框是否打开
    cy.contains('dialog', '删除铺位').should('be.visible');

    // 模拟删除API响应
    cy.intercept('POST', '/api/position/delete', {
      statusCode: 200,
      body: {
        code: 0,
        message: '删除成功'
      }
    }).as('deletePosition');

    // 确认删除
    cy.contains('dialog button', '删除').click();

    // 验证API调用
    cy.wait('@deletePosition');
  });

  it('应该能够返回列表页', () => {
    cy.wait('@getPositionDetail');

    // 点击返回按钮
    cy.contains('button', '返回').click();

    // 验证路由跳转
    cy.url().should('include', '/position');
  });
});
