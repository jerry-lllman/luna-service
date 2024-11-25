import { Body, Controller, Post } from '@nestjs/common'
import { ParseDto } from './dto/parse.dto'
import { PsdService } from './psd.service'

@Controller('psd')
export class PsdController {
  constructor(private readonly psdService: PsdService) { }

  @Post('parse')
  async parse(@Body() body: ParseDto) {
    return this.psdService.parse(body)
  }
}
