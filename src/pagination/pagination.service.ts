import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
 constructor(private readonly prisma: PrismaService) { }

 getPagination(dto: PaginationDto, defaultPerPage = 30) {
  const page = dto.page ? +dto.page : 1
  const perPage = dto.perPage ? +dto.perPage : defaultPerPage

  const skip = (page - 1) * perPage
  return{perPage,skip}
 }
}
