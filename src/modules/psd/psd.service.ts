import { Injectable } from '@nestjs/common'
import { ParseDto } from './dto/parse.dto'

@Injectable()
export class PsdService {
  async parse(body: ParseDto) {
    return body.url
  }
}
