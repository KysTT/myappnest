import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173', // Указываем точный источник фронтенда
    credentials: true, // Разрешаем отправку и прием куки
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
