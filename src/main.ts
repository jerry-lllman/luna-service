import { fastifyApp } from '@/common/adapters/fastify.adapter'
import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

import { useContainer } from 'class-validator'

import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { ConfigKeyPaths } from './config'
import { isDev } from './global/env'
import { setupSwagger } from './setup-swagger'
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

  app.enableCors({ origin: '*', credentials: true })

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  app.useGlobalPipes(
    new ValidationPipe({
      // 自动将传入的数据转换为 DTO 类定义的类型
      transform: true,
      // 去除掉那些没有使用任何验证装饰器的属性
      whitelist: true,
      // 当传入的参数不在装饰器中时，抛出错误
      forbidNonWhitelisted: false,
      transformOptions: {
        // 启用隐式类型转换，比如将字符串 "1" 转换为数字 1
        enableImplicitConversion: true,
      },
      // 设置验证错误时返回的 HTTP 状态码为 422（未处理的实体）
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      // 遇到第一个验证错误就停止验证
      stopAtFirstError: true,
      // 自定义错误处理工厂函数
      exceptionFactory: errors =>
        new UnprocessableEntityException(
          errors.map((e) => {
            // 获取第一个验证规则的名称
            const rule = Object.keys(e.constraints)[0]
            // 获取对应的错误信息
            const message = e.constraints[rule]
            return message
          })[0],
        ),
    }),
  )

  setupSwagger(app, configService)

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
