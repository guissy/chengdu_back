import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // 检查 City 表是否为空
    const cityCount = await prisma.city.count();

    if (cityCount === 0) {
      console.log('City table is empty, initializing with data from init.sql...');

      // 读取 SQL 文件
      const sqlFilePath = path.join(__dirname, 'init.sql');

      // 方法 1: 使用 Prisma 的 $executeRawUnsafe 执行 SQL
      const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

      // 分割多个 SQL 语句 (假设语句以分号结尾)
      const statements = sqlScript
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // 执行每个 SQL 语句
      for (const statement of statements) {
        await prisma.$executeRawUnsafe(`${statement};`);
      }

      // 方法 2: 使用命令行执行 SQL 文件 (PostgreSQL 示例)
      // 注意: 这需要在环境中安装了 psql 命令行工具
      // const dbUrl = process.env.DATABASE_URL;
      // execSync(`psql "${dbUrl}" < ${sqlFilePath}`);

      console.log('Database initialized successfully!');
    } else {
      console.log(`City table already contains ${cityCount} records, skipping initialization.`);
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
