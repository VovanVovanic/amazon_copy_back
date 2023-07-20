import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, PaymentStatusDto } from './dto/dto';
import { CurrentUser } from 'src/decorators/currentUser';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  @HttpCode(200)
  async getAllOrders(@CurrentUser('id') userId: number) {
    return this.orderService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
    return this.orderService.placeOrder(dto, userId);
  }

  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return await this.orderService.updateStatus(dto);
  }
}
