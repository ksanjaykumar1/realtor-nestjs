import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }
  @Get()
  getHome(@Param('id') id) {
    return { id };
  }
  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }
  @Put(':id')
  updateHome() {}

  @Delete(':id')
  deleteHome() {}
}
