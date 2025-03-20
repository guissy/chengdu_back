describe('广告位列表页测试', () => {
  beforeEach(() => {
    // 模拟API响应
    cy.intercept('POST', '/api/space/list', {
      statusCode: 200,
      body: {
        code: 200,
        data: {
          list: [
            {
              id: 'space-001',
              shopId: 'shop-001',
              type: 'TABLE_STICKER',
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
            },
            {
              id: 'space-001',
              shopId: 'shop-001',
              type: 'TABLE_PLACEMAT',
              setting: {
                size: '20cm x 20cm',
                material: '方桌餐垫纸',
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
          ]
        }
      }
    }).as('getSpaceList');

    // 访问广告位列表页
    cy.visit('/space').url().should('contain', '/space');

  });

  it('应该正确加载广告位列表页', () => {
    // 验证页面标题
    cy.contains('h1', '广告位管理').should('be.visible');
    cy.contains('p', '管理商家中的广告位资源').should('be.visible');

    // 等待API请求完成
    cy.wait('@getSpaceList');

    // 验证表格数据
    cy.contains('td', '方桌不干胶贴').should('be.visible');

  });

  it('应该能够搜索广告位', () => {
    cy.wait('@getSpaceList');

    // 输入搜索文本
    cy.get('input[placeholder="输入商家名或广告位类型"]').type('方桌不干胶贴');

    // 验证过滤结果
    cy.contains('td', '方桌不干胶贴').should('be.visible');
    cy.contains('td', 'SP002').should('not.exist');
  });

  it('应该能够按广告位类型筛选', () => {
    cy.wait('@getSpaceList');

    // 选择广告位类型
    cy.get('select').eq(0).select('方桌不干胶贴');

    // 验证过滤结果
    cy.contains('td', '方桌不干胶贴').should('be.visible');
    cy.contains('td', '方桌餐垫纸').should('not.exist');
  });


  it('应该能够打开新增广告位对话框', () => {
    // 点击新增广告位按钮
    cy.contains('button', '新增广告位').click();

    // 验证对话框是否打开
    cy.contains('dialog', '新增广告位').should('be.visible');

    // 关闭对话框
    // cy.get('button[aria-label="Close"]').click();
  });

  it('应该能够点击行跳转到详情页', () => {
    cy.wait('@getSpaceList');

    // 点击第一行
    cy.contains('td', '方桌不干胶贴').parent('tr').click();

    // 验证路由跳转
    cy.url().should('include', '/space/space-001');
  });

});
