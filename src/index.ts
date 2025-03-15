import { buildApp } from './app.js';
import { config } from './config/env.js';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      port: config.PORT,
      host: config.HOST,
    });

    const address = app.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    app.log.info(`Server listening on ${config.HOST}:${port}`);
    app.log.info(`Swagger UI available at http://${config.HOST}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// 使服务器优雅关闭
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

// 启动服务器
start();
