import { AllExceptionFilter } from '@/common/filters/any-exception.filter'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

import config from '@/config'
import { ExampleModule } from '@/modules/example/example.module'
import { PsdModule } from '@/modules/psd/psd.module'
import { SharedModule } from '@/shared/shared.module'

import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

/**
 * module 组织应用程序结构的基本单元
 * controller 处理传入的请求和返回响应
 * provider 实现业务逻辑的主要方式
 * middleware 处理请求和响应的中间件
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    SharedModule,
    ExampleModule,
    PsdModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
  ],
})
export class AppModule { }
