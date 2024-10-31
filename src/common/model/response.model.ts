import { RESPONSE_SUCCESS_CODE, RESPONSE_SUCCESS_MESSAGE } from '@/constants/response.constant'

export class ResOp<T = any> {
  data?: T

  code: number

  message: string

  constructor(code: number, data: T, message = RESPONSE_SUCCESS_MESSAGE) {
    this.code = code
    this.message = message
    this.data = data
  }

  static success<T>(data?: T, message?: string) {
    return new ResOp<T>(RESPONSE_SUCCESS_CODE, data, message)
  }

  static error(code: number, message: any) {
    return new ResOp(code, {}, message)
  }
}
