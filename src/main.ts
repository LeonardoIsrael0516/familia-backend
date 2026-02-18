import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Timeout na conexão com o banco para não travar se o Supabase estiver inacessível (ex.: firewall, IP não liberado).
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !/connect_timeout=/i.test(dbUrl)) {
    process.env.DATABASE_URL =
      dbUrl + (dbUrl.includes('?') ? '&' : '?') + 'connect_timeout=10';
  }

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('port');
  const corsOrigin = config.get<string>('cors.origin');
  if (port == null || Number.isNaN(port)) {
    throw new Error('Variável de ambiente PORT é obrigatória (ex.: 3000).');
  }
  if (!corsOrigin) {
    throw new Error('Variável de ambiente CORS_ORIGIN é obrigatória (ex.: http://localhost:8080).');
  }

  app.use(helmet());
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port, '0.0.0.0');
}

bootstrap();
