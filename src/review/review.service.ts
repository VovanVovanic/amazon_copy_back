import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PRODUCT_NOT_FOUND, returnedReview } from './constants';
import { ReviewDto } from './dto/review.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly product: ProductService,
  ) {}

  async getAll() {
    return await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: returnedReview,
    });
  }

  async create(userId: number, dto: ReviewDto, productId: number) {
    await this.product.byFeature(productId, undefined);
    return await this.prisma.review.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  }
  async updateProductAverageRating(productId: number) {
    const averageRating = await this.getAverageRating(productId)
    if (!averageRating) {
      throw new NotFoundException(PRODUCT_NOT_FOUND)
    }
    const updatedProduct = await this.prisma.product.update({
      where: {
        id:productId
      },
      data: {
        averageRating: +averageRating.avg_rating
      }
    })
    return updatedProduct
  }
  async getAverageRating(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => ({ avg_rating: data._avg.rating.toFixed() }));
  }
}
