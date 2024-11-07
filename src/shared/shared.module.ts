import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'

@Global()
@Module({
  imports: [
    // logger
    LoggerModule.forRoot(),
    HttpModule,
  ],
  exports: [HttpModule],
})

export class SharedModule {}
