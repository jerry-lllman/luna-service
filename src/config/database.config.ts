import { env, envBoolean, envNumber } from '@/global/env'

import { ConfigType, registerAs } from '@nestjs/config'

import dotenv from 'dotenv'

import { DataSource, DataSourceOptions } from 'typeorm'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', 3306),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE', false),
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
}

export const dbRegToken = 'database'

export const DatabaseConfig = registerAs(
  dbRegToken,
  () => dataSourceOptions,
)

export type DatabaseConfigType = ConfigType<typeof DatabaseConfig>

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
