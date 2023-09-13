import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/currentUser';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Auth('admin')
  async getAll() {
    return await this.reviewService.getAll();
  }

  @Post('create/:productId')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('user')
  async create(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService
      .create(id, dto, +productId)
      .then(() => this.reviewService.updateProductAverageRating(+productId));
  }

  @Get('average/:productId')
  @HttpCode(200)
  @Auth('user')
  async getAverageRating(@Param('productId') productId: string) {
    return this.reviewService.getAverageRating(+productId);
  }
}
