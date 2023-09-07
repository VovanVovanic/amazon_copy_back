import { Prisma } from '@prisma/client';
import { USER } from 'src/user/constants';
export const returnedReview: Prisma.ReviewSelect = {
  id: true,
  createdAt: true,
  rating: true,
  text: true,
  user: {
    select: USER,
  },
  product: {
    select: { name: true, id: true },
  },
};
export const PRODUCT_NOT_FOUND = 'Product not found';
