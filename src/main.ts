import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { fastifyApp } from '@/common/adapters/fastify.adapter'

import { NestFactory } from '@nestjs/core'

import { useContainer } from 'class-validator'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  )

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  }, (err, address) => {
    if (err) {
      console.error(err)
    }

    console.log(`🚀🚀🚀 Server is running on ${address}`)
  })
}
bootstrap()
