import { Module } from '@nestjs/common'
import { RabbitMQConfigModule } from '../rabbit-mq/rabbit-mq.config.module'
import { DesignController } from './design.controller'
import { DesignService } from './design.service'

@Module({
  controllers: [DesignController],
  providers: [DesignService],
  imports: [RabbitMQConfigModule],
})
export class DesignModule {}
