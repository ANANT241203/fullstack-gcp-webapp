import { config } from 'dotenv';
config({ path: 'cred.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (development only)
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Full Stack Webapp API')
    .setDescription('API documentation for the full stack assignment')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
