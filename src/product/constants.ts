import { returnedCategory } from '../category/constants';
import { returnedReview } from '../review/constants';
import { Prisma } from "@prisma/client";

export const returnedProduct: Prisma.ProductSelect = {
 images: true,
 description: true,
 id: true,
 name: true,
 price: true,
 createdAt: true,
 slug:true
}

export const returnedProductExpanded: Prisma.ProductSelect = {
 ...returnedProduct,
 reviews: { select: returnedReview },
 category:{select: returnedCategory}
}

export const NOT_FOUND="Product not found"
