import { fastifyApp } from '@/common/adapters/fastify.adapter'

import { Logger } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import { NestFactory } from '@nestjs/core'

import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { ConfigKeyPaths } from './config'
import { isDev } from './global/env'
import { LoggerService } from './shared/logger/logger.service'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  )

  const configService = app.get(ConfigService<ConfigKeyPaths>)

  const { port, globalPrefix } = configService.get('app', { infer: true })
  app.setGlobalPrefix(globalPrefix)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port,
  }, async () => {
    app.useLogger(app.get(LoggerService))

    const url = await app.getUrl()

    const logger = new Logger('NestApplication')

    logger.log(`🚀 Server is running on ${url}`)

    if (module.hot) {
      module.hot.accept()
      module.hot.dispose(() => app.close())
    }
  })
}
bootstrap()
