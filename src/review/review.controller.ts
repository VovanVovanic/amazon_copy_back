import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category/dto/createCategory.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/currentUser';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }
  
  @Get()
  async getAll() {
    return await this.reviewService.getAll()
  }

  @Post('create/:productId')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  @Auth()
  async update(
    @CurrentUser('id') id:number,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto) {
    return this.reviewService.create(id, dto, +productId)
  }

  @Get("average/:productId")
  @HttpCode(200)
  @Auth()
  async getAverageRating(@Param("productId") productId: string) {
    return this.reviewService.getAverageRating(+productId)
  }

}
