describe('商家详情页测试', () => {
  beforeEach(() => {
    // 模拟商家详情API响应
    cy.intercept('GET', '/api/shop/shop-001', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          id: 'shop-001',
          shop_no: 'SH001',
          trademark: '测试商家',
          branch: '总店',
          type: 'TEA_COFFEE',
          type_tag: '餐饮',
          verified: true,
          displayed: true,
          address: '成都市高新区',
          contact_name: '张三',
          contact_phone: '13800138000',
          description: '这是一家测试商家',
          logo: 'https://example.com/logo.png',
          environment_photo: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
        }
      }
    }).as('getShopDetail');

    // 访问商家详情页
    cy.visit('/shop/shop-001');
  });

  it('应该正确加载商家详情页', () => {
    // 等待API请求完成
    cy.wait('@getShopDetail');

    // 验证页面标题
    cy.contains('商家详情').should('be.visible');

    // 验证基本信息 - 限定在.card元素内
    cy.get('[data-cy=base-card]').first().should('exist').within(() => {
      cy.contains('商家编号').next().contains('SH001').should('be.visible');
      cy.contains('商标名称').next().contains('测试商家').should('be.visible');
      cy.contains('商家类型').next().contains('茶饮/咖啡').should('be.visible');
      cy.contains('品类标签').next().contains('餐饮').should('be.visible');
      cy.contains('认证状态').next().contains('已认证').should('be.visible');
      cy.contains('展示状态').next().contains('展示中').should('be.visible');
    });
  });

  it('应该能够编辑商家信息', () => {
    cy.wait('@getShopDetail');

    // 模拟更新API
    cy.intercept('POST', '/api/shop/update', {
      statusCode: 200,
      body: {
        code: 0,
        message: '更新成功'
      }
    }).as('updateShop');

    // 点击编辑按钮
    cy.contains('button', '编辑').click();

    // 验证编辑表单是否打开
    cy.contains('dialog', '编辑商家').should('be.visible');

    // 修改商家名称
    cy.get('input[name="trademark"]').clear().type('更新后的商家名称');

    // 提交表单
    cy.contains('button', '保存').click();

    // 等待API请求完成
    cy.wait('@updateShop');

    // 验证成功提示
    cy.contains('更新成功').should('be.visible');
  });

  it('应该能够返回列表页', () => {
    cy.wait('@getShopDetail');

    // 点击返回按钮
    cy.contains('button', '返回').click();

    // 验证路由跳转
    cy.url().should('include', '/shop');
  });

  it('应该能够查看商家图片', () => {
    cy.wait('@getShopDetail');

    // 验证商家图片是否显示
    cy.get('img[data-cy=environment-photo]').should('have.length.at.least', 1);

  });

  it('应该能够管理商家广告位', () => {
    cy.wait('@getShopDetail');

    // 模拟广告位列表API
    cy.intercept('POST', '/api/space/list', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: [
            {
              id: '1',
              name: '测试广告位1',
              status: 1,
              price: 100
            }
          ]
        }
      }
    }).as('getSpaceList');

    // 点击广告位详情
    cy.contains('button', '详情').click();
  });
});
