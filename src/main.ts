import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // for validation
const cookieSession = require('cookie-session'); // for cookie, use require instead of import (some issue with typescript)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieSession({
    keys: ['banana'] // for cookie encryption
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that are not defined in the DTO
    }),
  )


  await app.listen(3000, () => console.log('\nListening on port 3000\n'));
}
bootstrap();
