import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { User } from 'src/user/decorator/user.decorator';
import { UserToken } from 'src/user/interceptors/user.interceptor';

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
  createHome(@Body() body: CreateHomeDto, @User() user: UserToken) {
    console.log(body);
    return this.homeService.createHome(body, user.id);
  }
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserToken,
  ) {
    const home = await this.homeService.getRealtorByHomeId(id);
    if (home.realtor_id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHomebyId(id, body);
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserToken,
  ) {
    const home = await this.homeService.getRealtorByHomeId(id);
    if (home.realtor_id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }
}
