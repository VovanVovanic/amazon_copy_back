import { Prisma } from '@prisma/client';

export const returnedCategory: Prisma.CategorySelect = {
 id: true,
 name: true,
 slug: true,
 createdAt: true,
};

export const NOT_FOUND = 'Category not found';
export const ALREADY_EXIST = 'That category already exist';
