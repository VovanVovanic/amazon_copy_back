import { Prisma } from "@prisma/client";

export const returnedCategory:Prisma.CategorySelect = {
 id: true,
 name: true,
 slug:true
}

export const NOT_FOUND="Category not found"