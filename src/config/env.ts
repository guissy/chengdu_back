// import 'dotenv/config';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

export interface Config {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  LOG_LEVEL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_TIME_WINDOW: number;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
  HOST: process.env.HOST || DEFAULT_HOST,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
  RATE_LIMIT_TIME_WINDOW: process.env.RATE_LIMIT_TIME_WINDOW
    ? parseInt(process.env.RATE_LIMIT_TIME_WINDOW, 10)
    : 60000,
};

// 验证必要的环境变量
if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
