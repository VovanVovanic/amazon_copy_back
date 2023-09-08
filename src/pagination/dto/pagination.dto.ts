import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  perPage: string;

  @IsOptional()
  @IsString()
  page: string;
}
