describe('广告位详情页测试', () => {
  beforeEach(() => {
    // 访问广告位详情页
    cy.visit('/space/space-001');

    // 模拟API响应
    cy.intercept('GET', '/api/space/space-001', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          id: 'space-001',
          shopId: 'shop-001',
          type: '1',
          setting: {
            size: '20cm x 20cm',
            material: '防水不干胶',
            shape: '圆形'
          },
          count: 15,
          state: '1',
          price_factor: 1.2,
          tag: '桌贴',
          site: '1',
          stability: '1',
          photo: [
            'https://images.unsplash.com/photo-1560611588-163f49a6cbe5',
            'https://images.unsplash.com/photo-1564671546498-aa134722790f'
          ],
          description: '火锅店桌面贴广告，位于客人用餐视线范围内，关注度高，停留时间长。',
          design_attention: '设计应防水防油，考虑耐高温，色彩鲜明易于识别。',
          construction_attention: '施工时需保证贴纸平整无气泡，边缘处理圆滑。',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    }).as('getSpaceDetail');

  });

  it('应该正确加载广告位详情页', () => {
    // 等待API请求完成
    cy.wait('@getSpaceDetail');

    // 验证页面标题和返回按钮
    cy.contains('h1', '广告位详情').should('be.visible');
    cy.contains('button', '返回').should('be.visible');

    // 验证基本信息
    cy.get("[data-cy=space-base-card]").within(() => {
      cy.contains('商家编号');
      cy.contains('品类标签');
    })
  });

  it('应该显示广告位设置', () => {
    cy.wait('@getSpaceDetail');

    // 验证广告位设备
    cy.contains('广告位设置').should('be.visible');
  });


  it('应该能够编辑广告位信息', () => {
    cy.wait('@getSpaceDetail');

    // 点击编辑按钮
    cy.contains('button', '编辑').click();

    // 验证编辑对话框是否打开
    cy.contains('dialog', '编辑广告位').should('be.visible');

    // 修改广告位名称
    cy.get('textarea[name="description"]').first().type('会议室A（升级版）', { force: true });

    // 模拟更新API响应
    cy.intercept('POST', '/api/space/update', {
      statusCode: 200,
      body: {
        code: 0,
        message: '更新成功'
      }
    }).as('updateSpace');

    // 提交表单
    cy.contains('dialog button', '保存').click({ force: true });

    // 验证API调用
    cy.wait('@updateSpace');

    // 验证成功提示
    cy.contains('更新成功').should('be.visible');
  });

  it('应该能够更改广告位状态', () => {
    cy.wait('@getSpaceDetail');

    // 模拟状态更新API响应
    cy.intercept('POST', '/api/space/update', {
      statusCode: 200,
      body: {
        code: 0,
        message: '状态更新成功'
      }
    }).as('updateStatus');

    // 点击维护按钮
    cy.contains('button', '启用广告位').click();

    // 验证API调用
    cy.wait('@updateStatus');

    // 验证成功提示
    cy.contains('状态已更新').should('be.visible');
  });


  it('应该能够返回列表页', () => {
    cy.wait('@getSpaceDetail');

    // 点击返回按钮
    cy.contains('button', '返回').click();

    // 验证路由跳转
    cy.url().should('not.contain', '/space/space-001');
  });
});
