import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { DesignService } from './design.service'
import { CreateDesignDto } from './dto/create-design.dto'
import { UpdateDesignDto } from './dto/update-design.dto'

@Controller('design')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Post()
  create(@Body() createDesignDto: CreateDesignDto) {
    return this.designService.create(createDesignDto)
  }

  // @Get()
  // findAll() {
  //   return this.designService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.designService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDesignDto: UpdateDesignDto) {
  //   return this.designService.update(+id, updateDesignDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.designService.remove(+id);
  // }

  // @Post('generate')
  // generate(@Body() generateDto: GenerateDto) {
  //   return this.designService.generate(generateDto)
  // }
}
