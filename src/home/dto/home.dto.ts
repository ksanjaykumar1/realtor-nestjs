import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;

  @Exclude()
  listed_Date: Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_Date;
  }

  price: number;

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  propertyType: PropertyType;

  @Exclude()
  created_at: Date;
  @Expose({ name: 'createdAt' })
  createdAt() {
    return this.created_at;
  }

  @Exclude()
  updated_at: Date;
  @Expose({ name: 'updatedAt' })
  updatedAt() {
    return this.updated_at;
  }

  @Exclude()
  realtor_id: number;
  @Expose({ name: 'realtorId' })
  realtorId() {
    return this.realtor_id;
  }

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
