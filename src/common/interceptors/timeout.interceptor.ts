import { CallHandler, ExecutionContext, NestInterceptor, RequestTimeoutException } from '@nestjs/common'
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs'

export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly time: number = 10000) { }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.time),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('request timeout, please try again later'))
        }

        return throwError(() => err)
      }),
    )
  }
}
