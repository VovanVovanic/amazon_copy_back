import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnedReview } from './constants';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
 constructor(private readonly prisma: PrismaService) { }


 async getAll() {
  return await this.prisma.review.findMany({
   orderBy:{createdAt:'desc'},
   select: returnedReview
  })
 }

 async create(userId:number, dto:ReviewDto, productId:number) {
  return await this.prisma.review.create({
   data: {
    ...dto,
    product: { connect: { id: productId } },
    user:{connect:{id:userId}}
   }
  })
 }
 async getAverageRating(productId: number) {
  return this.prisma.review.aggregate({
   where: { productId },
   _avg:{rating:true}
}).then((data)=>({avg_rating:data._avg.rating.toFixed(1)}))
}
}
