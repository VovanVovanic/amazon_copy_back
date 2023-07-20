/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto, PaymentStatusDto } from './dto/dto';
import { returnedProduct } from 'src/product/constants';
import * as YooKassa from 'yookassa'
import { faker } from '@faker-js/faker';
import { EnumOrderStatus } from '@prisma/client';
import { returnedOrders } from './constants';

const yookassa = new YooKassa({
    shopId:process.env['SHOP_ID'],
    secretKey:process.env['PAYMENT_TOKEN']
})
@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId:number) {
    return await this.prisma.order.findMany({
      where:{userId},
      orderBy: { createdAt: 'desc' },
      select:returnedOrders
    });
  }
  async placeOrder(dto: OrderDto, userId:number) {

    const total = dto.items.reduce((acc, el)=>{
      acc += (el.price*el.quantity)
      return acc
    },0)
    console.log(total, "ttt")
    const res = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items,
        },
        total:total,
        user:{
            connect:{
                id:userId
            }
        }
      },
    });
    const payment = await yookassa.createPayment({
      amount:{
        value:total.toFixed(2),
        currency:'RUB'
      },
      payment_method_data:{
        type:'bank_card'
      },
      confirmation:{
        type:'redirect',
        return_url: 'http://localhost:3000/thanks'
      },
      description: `Order: ${res.id}`
    })
    return payment;
  }

  async updateStatus(dto:PaymentStatusDto){
    if(dto.event === 'payment.waiting_for_capture'){
      const payment = await yookassa.capturePayment(dto.object.id)
      return payment
    }
    if(dto.event === 'payment.succeeded'){
      const orderId = Number(dto.object.description.split(' ')[1])
      await this.prisma.order.update({
        where:{id:orderId},
        data:{
          status:EnumOrderStatus.PAYED
        }
      })
      return true
    }
    return true
  }
  
}
