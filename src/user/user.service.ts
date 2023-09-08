/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EMAIL_IN_USE, NOT_FOUND, USER } from './constants';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/updateUser.dto';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
 constructor(private readonly prisma: PrismaService) { }

 async getById(id: number, selectObject: Prisma.UserSelect = {}) {
  const user = await this.prisma.user.findUnique({
   where: {
    id
   },
   select: {
    ...USER,
    favorites: {
     select: {
      id: true,
      name: true,
      price: true,
      images: true,
      slug: true,
      category: {
       select: {
        slug: true
       }
      },
      reviews: true
     }
    },
    ...selectObject
   }
  })
  if (!user) {
   throw new Error(NOT_FOUND)
  }
  else {
   return user
  }
 }

 async updateProfile(id: number, dto: UserDto) {
  const isSameUser = await this.prisma.user.findFirst({
   where: { OR: [{ email: dto.email }, { id }] }

  })

  if (isSameUser && isSameUser.id !== id) {
   throw new BadRequestException(EMAIL_IN_USE)
  }
  else {
   const user = await this.getById(id)
   const { password, ...rest } = dto
   const updatedUser = await this.prisma.user.update({
    where: {
     id
    },
    data: {
     ...rest,
     password: password ? await hash(password) : user.password
    }
   })
   return updatedUser
  }
 }

 async deleteProfile(id: number) {
  return await this.prisma.user.delete({
   where: { id },
  });
 }

 async toggleFavorites(id: number, productId: string) {
  try {
   const user = await this.getById(id)
   const isExist = user.favorites.some((el) => el.id === +productId)
   await this.prisma.user.update({
    where: {
     id
    },
    data: {
     favorites: {
      [isExist ? 'disconnect' : 'connect']: { id: +productId }
     }
    }
   })

   const message = isExist ? "Removed from Favorites" : "Added to Favorites"
   return message
  } catch (e) {
   Logger.error(e)
  }

 }
}
