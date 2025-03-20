describe('商家列表页测试', () => {
  beforeEach(() => {
    // 访问商家列表页
    cy.visit('/shop').url().should('contain', '/shop');

    // 模拟API响应
    cy.intercept('GET', '/api/shop/list', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: [
            {
              id: 'shop-001',
              shop_no: 'SH001',
              trademark: '测试商家1',
              branch: '总店',
              type: 1,
              type_tag: '餐饮',
              verified: true,
              displayed: true
            },
            {
              id: 'shop-002',
              shop_no: 'SH002',
              trademark: '测试商家2',
              branch: '',
              type: 2,
              type_tag: '轻食',
              verified: false,
              displayed: false
            }
          ]
        }
      }
    }).as('getShopList');
  });

  it('应该正确加载商家列表页', () => {
    // 验证页面标题
    cy.contains('h1', '商家管理').should('be.visible');
    cy.contains('p', '管理所有商家信息').should('be.visible');

    // 等待API请求完成
    cy.wait('@getShopList');

    // 验证表格数据
    cy.contains('td', 'SH001').should('be.visible');
    cy.contains('td', '测试商家1(总店)').should('be.visible');
    cy.contains('td', '餐饮').should('be.visible');
    cy.contains('td', '已认证').should('be.visible');

    cy.contains('td', 'SH002').should('be.visible');
    cy.contains('td', '测试商家2').should('be.visible');
    cy.contains('td', '轻食').should('be.visible');
    cy.contains('td', '未认证').should('be.visible');
  });

  it('应该能够搜索商家', () => {
    cy.wait('@getShopList');

    // 输入搜索文本
    cy.get('input[placeholder="输入商家编号或名称"]').type('测试商家1');

    // 验证过滤结果
    cy.contains('td', 'SH001').should('be.visible');
    cy.contains('td', 'SH002').should('not.exist');
  });

  it('应该能够按商家类型筛选', () => {
    cy.wait('@getShopList');

    // 选择商家类型
    cy.get('select').eq(0).select('餐饮');

    // 验证过滤结果
    cy.contains('td', 'SH001').should('be.visible');
    cy.contains('td', 'SH002').should('not.exist');
  });

  it('应该能够按认证状态筛选', () => {
    cy.wait('@getShopList');

    // 选择认证状态
    cy.get('select').eq(1).select('已认证');

    // 验证过滤结果
    cy.contains('td', 'SH001').should('be.visible');
    cy.contains('td', 'SH002').should('not.exist');
  });

  it('应该能够打开新增商家对话框', () => {
    // 点击新增商家按钮
    cy.contains('button', '新增商家').click();

    // 验证对话框是否打开
    cy.contains('dialog', '新增商家').should('be.visible');

    // 关闭对话框
    // cy.get('button[aria-label="Close"]').click();
  });

  it('应该能够点击行跳转到详情页', () => {
    cy.wait('@getShopList');

    // 点击第一行
    cy.contains('td', 'SH001').parent('tr').click();

    // 验证路由跳转
    cy.url().should('include', '/shop/shop-001');
  });

  it('应该能够点击删除按钮打开删除对话框', () => {
    cy.wait('@getShopList');

    // 点击删除按钮
    cy.contains('button', '删除').first().click();

    // 验证删除对话框是否打开
    cy.contains('dialog', '删除商家').should('be.visible');

    // 关闭对话框
    // cy.get('button[aria-label="Close"]').click();
  });
});
