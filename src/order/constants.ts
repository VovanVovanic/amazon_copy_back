import { Prisma } from "@prisma/client";
import { USER } from "src/user/constants";

export const returnedOrders: Prisma.OrderSelect = {
 createdAt: true,
 id: true,
 items: {
  select: {
   id: true,
   createdAt: true,
   price: true,
   quantity:true
  }
 },
 status:true,
 user:{select:USER}
}