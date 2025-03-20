describe('铺位列表页测试', () => {
  beforeEach(() => {
    // 访问铺位列表页
    cy.visit('/position').url().should('contain', '/position');

    // 模拟API响应
    cy.intercept('POST', '/api/position/list', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: [
            {
              id: 'pos-001',
              position_no: 'P001',
              partId: 'part-001',
              title: '前端开发工程师',
              department: '技术部',
              type: 1,
              type_tag: '技术类',
              status: 1,
              status_tag: '招聘中',
              salary_range: '15k-25k'
            },
            {
              id: 'pos-002',
              position_no: 'P002',
              partId: 'part-002',
              title: '产品经理',
              department: '产品部',
              type: 2,
              type_tag: '产品类',
              status: 0,
              status_tag: '已暂停',
              salary_range: '20k-30k'
            }
          ]
        }
      }
    }).as('getPositionList');

    cy.intercept('POST', '/api/part/list', {
      statusCode: 200,
      body: {
        code: 0,
        data: {
          list: [{
            id: 'part-001',
            name: '三里屯通盈中心西区B1层',
            sequence: -1,
            cbdId: 'cbd-001',
            createdAt: new Date(),
            updatedAt: new Date()
          },
            {
              id: 'part-002',
              name: '三里屯通盈中心北区1层',
              sequence: 1,
              cbdId: 'cbd-001',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      }
    }).as('getPartList');
  });

  it('应该正确加载铺位列表页', () => {
    // 验证页面标题
    cy.contains('h1', '铺位管理').should('be.visible');
    cy.contains('p', '管理铺位信息和关联的商家').should('be.visible');

    // 等待API请求完成
    cy.wait('@getPositionList');

    // 验证表格数据
    cy.contains('td', 'P001').should('be.visible');
    cy.contains('td', '技术类').should('be.visible');
    cy.contains('td', 'P002').should('be.visible');
    cy.contains('td', '产品类').should('be.visible');
    cy.contains('td', '未认证').should('be.visible');
    cy.contains('td', '已隐藏').should('be.visible');
  });

  it('应该能够搜索铺位', () => {
    cy.wait('@getPositionList');

    // 输入搜索文本
    cy.get('input[placeholder="输入铺位编号或商家编号"]').type('P001');

    // 验证过滤结果
    cy.contains('td', 'P001').should('be.visible');
    cy.contains('td', 'P002').should('not.exist');
  });

  it('应该能够按小区筛选', () => {
    cy.wait('@getPositionList');
    cy.wait('@getPartList');

    // 选择招聘状态
    cy.get('select[data-cy="part-select"]').select('part-001');

    // 验证过滤结果
    cy.contains('td', 'P001').should('be.visible');
  });

  it('应该能够打开新增铺位对话框', () => {
    // 点击新增铺位按钮
    cy.contains('button', '新增铺位').click();

    // 验证对话框是否打开
    cy.contains('dialog', '新增铺位').should('be.visible');

    // 关闭对话框
    // cy.get('button[aria-label="Close"]').click();
  });

  it('应该能够点击行跳转到详情页', () => {
    cy.wait('@getPositionList');

    // 点击第一行
    cy.contains('td', 'P001').parent('tr').click();

    // 验证路由跳转
    cy.url().should('include', '/position/pos-001');
  });
});
