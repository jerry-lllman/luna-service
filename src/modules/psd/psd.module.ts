import { Module } from '@nestjs/common'
import { PsdController } from './psd.controller'
import { PsdService } from './psd.service'

@Module({
  imports: [],
  controllers: [PsdController],
  providers: [PsdService],
})
export class PsdModule { }
