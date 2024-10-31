import { SetMetadata } from '@nestjs/common'

export const BYPASS_KEY = Symbol('__BYPASS_KEY__')

/**
 * If the decorator is used, the interceptor will not be executed
 */
export const Bypass = () => SetMetadata(BYPASS_KEY, true)
