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
  await bootstrap();
  server(req, res);
}
