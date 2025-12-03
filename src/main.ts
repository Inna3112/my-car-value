import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //це глобальні middleware, які будуть працювати для всіх роутів
  // app.use(
  //   cookieSession({
  //     keys: ['dddd'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
