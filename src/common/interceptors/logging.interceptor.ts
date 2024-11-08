import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name, { timestamp: false })

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const content = `[${request.method}] ${request.url}`
    this.logger.debug(`🍄 ${content}`)
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`✨ ${content} +${Date.now() - now}ms`)
      }),
    )
  }
}
