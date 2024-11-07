import { AppConfig, appRegToken, IAppConfig } from './app.config'

export interface AllConfigType {
  [appRegToken]: IAppConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
}
