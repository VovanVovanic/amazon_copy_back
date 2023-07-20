/* eslint-disable prettier/prettier */
import { PaginationDto } from './../../pagination/dto/pagination.dto';
import { ArrayMinSize, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class ProductDto{
 @IsString()
 name: string
 
 @IsNumber()
 price: number
 
 @IsString()
 description: string

 @IsString({ each: true })
 @ArrayMinSize(1)
 images: string[]
 
 @IsString()
 categoryId: string
}


export enum EnumProductsSort{
 HIGH_PRICE = 'high-price',
 LOW_PRICE = "low-price",
 NEWEST = "newest",
 OLDEST = "oldest"
}

export class GetAllProductsDto extends PaginationDto{
 @IsOptional()
 @IsEnum(EnumProductsSort)
 sort?: EnumProductsSort

 @IsString()
 @IsOptional()
 searchTerm?: string
}