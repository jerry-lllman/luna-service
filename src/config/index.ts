import { AppConfig, appRegToken, IAppConfig } from './app.config'
import { DatabaseConfig, DatabaseConfigType, dbRegToken } from './database.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config'

export * from './app.config'
export * from './database.config'
export * from './swagger.config'

export interface AllConfigType {
  [appRegToken]: IAppConfig
  [swaggerRegToken]: ISwaggerConfig
  [dbRegToken]: DatabaseConfigType
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  SwaggerConfig,
  DatabaseConfig,
}
