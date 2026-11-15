import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from '../src/app.module.js';

const server = express();

let bootstrapped: Promise<unknown> | undefined;

async function bootstrap() {
  bootstrapped ??= (async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.enableCors({
      origin: process.env.FRONTEND_URL ?? '*',
      credentials: true,
    });

    await app.init();
  })();
  return bootstrapped;
}

export default async function handler(req: express.Request, res: express.Response) {
  try {
    await bootstrap();
  } catch (err) {
    console.error('Bootstrap failed:', err);
    res.status(500).json({
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  // Serve the status page at the site root; JSON health at /health(z)
  const path = req.url?.split('?')[0];
  if (req.method === 'GET') {
    if (path === '/') req.url = '/api/status-page';
    else if (path === '/health' || path === '/healthz') req.url = '/api/health';
  }

  server(req, res);
}
