import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { UserInfo } from 'src/user/interceptors/user.interceptor';

interface GetHomesPram {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}
interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}
@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filters: GetHomesPram): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: false,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });
    return homes.map((home) => new HomeResponseDto(home));
  }
  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      price,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        price,
        propertyType,
        realtor_id: userId,
      },
    });
    console.log(images);
    const homeImages = images.map((image) => {
      // console.log(image);
      return { ...image, home_id: home.id };
    });
    // console.log(homeImages);

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }
  async updateHomebyId(id: number, data: UpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) {
      throw new NotFoundException();
    }
    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data,
    });
    return new HomeResponseDto(updatedHome);
  }
  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });

    await this.prismaService.home.delete({
      where: {
        id,
      },
    });
  }
  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      // select: {
      //   realtor: {
      //     select: {
      //       name: true,
      //       id: true,
      //       email: true,
      //       phone: true,
      //     },
      //   },
      // },
    });
    if (!home) {
      throw new NotFoundException(`Home not found with id : ${id}`);
    }
    return home;
  }
  async inquire(buyer: UserInfo, homeId: number, message: string) {
    const { realtor_id } = await this.getRealtorByHomeId(homeId);
    return this.prismaService.message.create({
      data: {
        buyer_id: buyer.id,
        home_id: homeId,
        message,
        realtor_id: realtor_id,
      },
    });
  }
  async getMessagesByHome(realtor: UserInfo, homeId: number) {
    const { realtor_id } = await this.getRealtorByHomeId(homeId);
    if (realtor_id !== realtor.id) {
      throw new UnauthorizedException();
    }
    return this.prismaService.message.findMany({
      where: {
        realtor_id: realtor_id,
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
