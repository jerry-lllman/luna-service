import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config'

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
) {
  const { name, port } = configService.get<IAppConfig>('app')!
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!

  if (!enable)
    return

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion('1.0')

  const document = SwaggerModule.createDocument(app, documentBuilder.build())

  SwaggerModule.setup(path, app, document)

  const logger = new Logger('Swagger')
  logger.log(`📖 Swagger is running on http://localhost:${port}/${path}`)
}
