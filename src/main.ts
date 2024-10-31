import { NestFactory } from '@nestjs/core';

import { NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module';
import { fastifyApp } from '@/common/adapters/fastify.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true
    }
  );



  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  }, (err, address) => {
    if (err) {
      console.error(err)
    }

    console.log(`🚀🚀🚀 Server is running on ${address}`)
  });
}
bootstrap();
