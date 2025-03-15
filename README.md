# 业务系统 API 服务

这个项目是一个基于 TypeScript、Fastify、OpenAPI、Swagger UI 和 Zod 构建的业务系统 API 服务。

## 技术栈

- **TypeScript**: 强类型的 JavaScript 超集
- **Fastify**: 高性能的 Node.js Web 框架
- **Prisma**: 现代 ORM 工具
- **OpenAPI/Swagger**: API 文档生成与测试
- **Zod**: 类型验证库

## 功能

该系统支持以下主要业务实体的管理：

- **城市与行政区划**: 地理位置层级管理
- **商圈**: 商业区域管理
- **物业小区**: 商业建筑内的区域管理
- **铺位**: 租赁单元管理
- **商家**: 商户信息管理
- **广告位**: 广告资源管理

## 项目结构

```
business-system/
├── src/                           # 源代码目录
│   ├── app.ts                     # Fastify 应用主入口
│   ├── index.ts                  # 服务器启动
│   ├── config/                    # 配置文件
│   ├── plugins/                   # Fastify 插件
│   ├── routes/                    # API 路由
│   ├── controllers/               # 控制器
│   ├── services/                  # 业务逻辑
│   ├── schemas/                   # Zod 验证模式
│   ├── interfaces/                # TypeScript 接口
│   ├── types/                     # TypeScript 类型
│   └── utils/                     # 工具函数
├── prisma/                        # Prisma ORM 相关文件
│   ├── schema.prisma              # 数据库模型定义
│   └── seed.ts                    # 数据库种子脚本
├── tests/                         # 测试目录
└── ...
```

## 安装和运行

### 前置条件

- Node.js 16.x 或更高版本
- PostgreSQL 数据库

### 安装步骤

1. 克隆仓库
```bash
git clone https://your-repository-url/business-system.git
cd business-system
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等信息
```

4. 创建数据库结构
```bash
npm run prisma:migrate
```

5. 加载测试数据（可选）
```bash
npm run prisma:seed
```

6. 启动开发服务器
```bash
npm run dev
```

现在您可以访问 `http://localhost:3000/docs` 查看 API 文档并测试 API。

## API 文档

API 文档使用 Swagger UI 自动生成，可在开发服务器运行时通过访问 `/docs` 路径获得。

## 开发

### 可用命令

- `npm run build` - 构建项目
- `npm run start` - 运行生产版本
- `npm run dev` - 以开发模式运行（支持热重载）
- `npm run lint` - 检查代码风格
- `npm run format` - 格式化代码
- `npm test` - 运行测试
- `npm run prisma:generate` - 生成 Prisma 客户端
- `npm run prisma:migrate` - 创建和应用数据库迁移
- `npm run prisma:studio` - 启动 Prisma Studio 可视化数据库工具

## 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可证

[ISC](LICENSE)
