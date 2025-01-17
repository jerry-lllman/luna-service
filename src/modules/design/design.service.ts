import path from 'node:path'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import fsExtra from 'fs-extra'
import { CreateDesignDto } from './dto/create-design.dto'
import { UpdateDesignDto } from './dto/update-design.dto'
import { GeneratorCode } from './parserComponents'

@Injectable()
export class DesignService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async create(createDesignDto: CreateDesignDto) {
    const generator = new GeneratorCode(createDesignDto)

    const code = generator.generateCode()
    const index = generator.generateIndex()
    const packageJson = generator.generatePackageJson()
    const viteConfig = generator.generateViteConfig()
    const html = generator.generateHtml()
    const tsconfig = generator.generateTsconfig()
    // 将文件写入到 projects 目录下
    const projectDir = path.join(process.cwd(), 'projects')

    fsExtra.ensureDirSync(path.join(projectDir, 'src'))
    fsExtra.writeFileSync(path.join(projectDir, 'src/App.tsx'), code)
    fsExtra.writeFileSync(path.join(projectDir, 'src/main.tsx'), index)
    fsExtra.writeFileSync(path.join(projectDir, 'package.json'), packageJson)
    fsExtra.writeFileSync(path.join(projectDir, 'vite.config.ts'), viteConfig)
    fsExtra.writeFileSync(path.join(projectDir, 'index.html'), html)
    fsExtra.writeFileSync(path.join(projectDir, 'tsconfig.json'), tsconfig)

    // 生成 项目 id 入库
    // const projectId = "xxx-sss"

    // 在 rabbitmq 中发送消息
    try {
      await this.amqpConnection.publish('luna-exchange', 'routing.key', {
        message: 'Your message payload here',
      })
    }
    catch (error) {
      console.log(error)
    }

    // 返回成功
    return { code, packageJson }
  }
}
