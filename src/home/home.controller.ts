import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  getHomes() {
    return [];
  }
  @Get('id')
  getHome(@Param('id') id) {
    return { id };
  }
  @Post()
  createHome() {
    return {};
  }

  @Put(':id')
  updateHome() {}

  @Delete(':id')
  deleteHome() {}
}
