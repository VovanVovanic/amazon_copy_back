import { PrismaService } from './../prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EMAIL_IN_USE, NOT_FOUND, USER } from './constants';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/updateUser.dto';
import { hash } from 'argon2';

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
      slug: true
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
  const isSameUser = await this.prisma.user.findUnique({
   where:{email:dto.email}
  })

  if (isSameUser && isSameUser.id !== id) {
   throw new BadRequestException(EMAIL_IN_USE)
  }
  else {
   const user = await this.getById(id)
   const{password, ...rest} = dto
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

 async toggleFavorites(id: number, productId: string) {
  const user = await this.getById(id)
  const isExist = user.favorites.some((el) => el.id === +productId)
  
  await this.prisma.user.update({
   where: {
    id
   },
   data: {
    favorites: {
     [isExist ? 'disconnect' :'connect']:{id:productId}
    }
   }
  })
 }
}
