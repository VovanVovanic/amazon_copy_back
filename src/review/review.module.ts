import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService, CategoryService],
  imports: [ProductModule, PaginationModule, CategoryModule],
})
export class ReviewModule {}
