import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerUtil } from './util/swagger.util';
// import { PORT } from './util/constants';

export async function bootstrap() {
  const swaggerUtil = new SwaggerUtil();
  const app = await NestFactory.create(AppModule);

  // Middlewares
  app.enableCors();

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //swagger documentation setup
  swaggerUtil.setupSwagger(app);

  await app.listen(3000).then(() => console.log(`server running on port ${3000}`));
}
bootstrap();