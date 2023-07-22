import { Prisma } from '@prisma/client';
export const USER: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  password: false,
  phone: true,
};

export const NOT_FOUND = 'User not found';
export const EMAIL_IN_USE = 'Email already in use';
