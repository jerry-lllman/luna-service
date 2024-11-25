import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class ParseDto {
  @ApiProperty({
    description: 'PSD 文件的 URL',
    example: 'https://example.com/file.psd',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string
}
