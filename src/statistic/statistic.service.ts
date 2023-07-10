import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NOT_FOUND } from 'src/user/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {

 constructor(private readonly prisma: PrismaService,
  private readonly user: UserService,
 ) { }

 async getStatystic(userId: number) {
  try {
   const user = await this.user.getById(userId, {
    orders: {
      select:{items:true}
    },
    reviews: true,
    favorites:true
   })
   if (!user) {
    throw new NotFoundException(NOT_FOUND)
   }
   else {
    const { orders, reviews, favorites } = user
    let total: number = 0
    reviews.forEach((el) => {
     total+=el.rating
    })
    return {
     orders: orders.length,
     reviews: reviews.length,
     favorites: favorites.length,
     totalCountReviews: total
    }
   }
  } catch (e) {
   Logger.error(e)
   return e
  }
 }
}
