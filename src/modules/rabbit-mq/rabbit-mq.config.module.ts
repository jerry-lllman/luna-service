import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      // uri: 'amqp://localhost:5672',
      uri: 'amqp://user:password@localhost:5672',
      exchanges: [
        {
          name: 'luna-exchange',
          type: 'topic', // 交换机类型
        },
      ],
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQConfigModule {}
