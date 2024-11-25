import { env, envBoolean } from '@/global/env'
import { ConfigType, registerAs } from '@nestjs/config'

export const swaggerRegToken = 'swagger'

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: envBoolean('SWAGGER_ENABLE'),
  path: env('SWAGGER_PATH'),
}))

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>
