import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  
  // Global middleware
  app.useGlobalPipes(

    // app에 오는 모든 incoming requests를 validate 
    new ValidationPipe()
  );
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap(); 