import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

class SourceInfoDto {
  @ApiProperty({
    description: '包名',
    example: 'luna-ui',
  })
  @IsNotEmpty()
  @IsString()
  packageName: string

  @ApiProperty({
    description: '版本',
    example: '1.0.0',
  })
  @IsNotEmpty()
  @IsString()
  version: string

  @ApiProperty({
    description: '是否解构',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  destructure: boolean

  @ApiProperty({
    description: '导出名称',
    example: 'Button',
  })
  @IsNotEmpty()
  @IsString()
  exportName: string

  @ApiProperty({
    description: '别名',
    example: 'ButtonComponent',
  })
  @IsOptional()
  @IsString()
  aliasName: string
}

class ComponentDto {
  @ApiProperty({
    description: '组件名称',
    example: 'Button',
  })
  @IsNotEmpty()
  @IsString()
  componentName: string

  @ApiProperty({
    description: '组件源信息',
    type: SourceInfoDto,
  })
  @ValidateNested()
  @Type(() => SourceInfoDto)
  sourceInfo: SourceInfoDto

  @ApiProperty({
    description: '组件属性',
    example: { color: 'red', size: '10px' },
  })
  @IsOptional()
  props?: Record<string, any>
}

export class DesignComponentDto {
  @ApiProperty({
    description: '组件ID',
    example: 'xxx-xxx',
  })
  @IsOptional()
  @IsString()
  id?: string

  @ApiProperty({
    description: '组件类型',
    example: 1,
  })
  @IsNotEmpty()
  type: number

  @ApiProperty({
    description: '组件名称',
    example: '按钮',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: '组件图标',
    example: 'icon-button',
  })
  @IsNotEmpty()
  @IsString()
  icon: string

  @ApiProperty({
    description: '组件详情',
    type: ComponentDto,
  })
  @ValidateNested()
  @Type(() => ComponentDto)
  component: ComponentDto
}

export class CreateDesignDto {
  @ApiProperty({
    description: '设计名称',
    example: '设计名称',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: '设计路径',
    example: 'design/123',
  })
  @IsNotEmpty()
  @IsString()
  pathname: string

  @ApiProperty({
    description: '组件列表',
    type: [DesignComponentDto],
    example: [{ id: 'xxx-xxx', type: 1, name: '按钮', icon: 'icon-button', component: { name: 'Button', props: { data: 1, hover: true } } }],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DesignComponentDto)
  components: DesignComponentDto[]
}
