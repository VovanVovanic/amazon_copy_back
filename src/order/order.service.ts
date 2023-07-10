import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnedOrders } from './constants';

@Injectable()
export class OrderService {
 constructor(private readonly prisma: PrismaService) { }

 async getAll() {
  return await this.prisma.order.findMany({
   orderBy:{createdAt:'desc'},
   select: returnedOrders
  })
 }
}
