/* eslint-disable prettier/prettier */

import { EnumOrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  productId: number;
}

class AmountPayment {
  value: string;
  currency: string;
}

class ObjectPayment {
  id: string;
  status: string;
  amount: AmountPayment;
  payment_method: {
    type: string;
    id: number;
    saved: boolean;
    title: string;
    card: object;
  };
  description: string;
  created_at: string;
  updated_at: string;
}

export class PaymentStatusDto {
  event:
    | "payment.succeeded"
    | "payment.waiting_for_capture"
    | "payment.canceled"
    | "refund.success";
  type: string;
  object: ObjectPayment;
}
