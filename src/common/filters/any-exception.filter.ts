import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constants/error-code.constant'
import { isDev } from '@/global/env'
import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

interface myError {
  readonly status: number
  readonly statusCode?: number
  readonly message?: string
}

export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name)

  constructor() {
    this.registerCatchAllExceptionsHook()
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()

    const url = request.raw.url!

    const status = this.getStatus(exception)
    let message = this.getErrorMessage(exception)

    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR
      && !(exception instanceof BusinessException)
    ) {
      Logger.error(exception, undefined, 'Catch')
      if (!isDev) {
        message = ErrorEnum.SERVICE_ERROR?.split(':')[1]
      }
    }
    else {
      this.logger.warn(
        `Error Info: (${status}) ${message} Path: ${decodeURI(url)}`,
      )
    }

    const apiErrorCode = exception instanceof BusinessException ? exception.getErrorCode() : status

    const resBody: IBaseResponse = {
      code: apiErrorCode,
      message,
      data: null,
    }

    response.status(status).send(resBody)
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    else {
      return (exception as myError)?.status ?? (exception as myError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message
    }
    else {
      return (exception as any)?.response?.message ?? (
        exception as myError
      )?.message ?? `${exception}`
    }
  }

  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => {
      console.error('🚨🚨🚨 Unhandled Rejection at:', reason)
    })

    process.on('uncaughtException', (err) => {
      console.error('🚨🚨🚨 Uncaught Exception:', err)
    })
  }
}
