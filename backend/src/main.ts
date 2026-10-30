import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { resolve } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/uploads/avatars',
    express.static(resolve(__dirname, '../uploads/avatars'), {
      dotfiles: 'deny',
      index: false,
      maxAge: '1d',
      immutable: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT') ?? 3001;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
void bootstrap();
