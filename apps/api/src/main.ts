import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  GlobalExceptionFilter,
  TransformResponseInterceptor,
  LoggingInterceptor,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Global Middlewares
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global API Prefix (/api/v1)
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Management System API')
    .setDescription(
      'Production-grade REST API for Inventory Management System POS, Inventory, Procurement, and Financial Management',
    )
    .setVersion('1.0')
    .addCookieAuth('sms_session')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[IMS-API] Application is running on: http://localhost:${port}/api/v1`);
  console.log(`[IMS-API] Swagger API documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
