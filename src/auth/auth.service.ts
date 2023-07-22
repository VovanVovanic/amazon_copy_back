/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { INVALID_PASSWORD, INVALID_REFRESH_TOKEN, NOT_FOUND, USER_EXIST } from './constants';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
 constructor(private readonly prismaService: PrismaService,
  private readonly jwt: JwtService,
  private readonly userService: UserService
 ) { }

 async getNewTokens(refreshToken: string) {
  const res = await this.jwt.verifyAsync(refreshToken)
  if (!res) {
   throw new UnauthorizedException(INVALID_REFRESH_TOKEN)
  }
  else {
   const user = await this.userService.getById(res.id,{isAdmin:true})
   const tokens = await this.getTokens(user.id)
   return {
    user: this.returnUserFields(user),
    ...tokens
   }
  }
 }

 async login(dto: AuthDto) {
  const user = await this.validateUser(dto)
  const tokens = await this.getTokens(user.id)
  return {
   user: this.returnUserFields(user),
   ...tokens
  }
 }
 async register(dto: AuthDto) {
  const oldUser = await this.prismaService.user.findUnique({
   where: { email: dto.email }
  })
  if (oldUser) {
   throw new BadRequestException(USER_EXIST)
  }
  else {
   const user = await this.prismaService.user.create({
    data: {
     email: dto.email,
     password: await hash(dto.password),
     avatarPath: faker.image.avatar(),
     name: faker.person.firstName(),
     phone: faker.phone.number('+371 ########')
    }
   })

   const tokens = await this.getTokens(user.id)
   return {
    user: this.returnUserFields(user),
    ...tokens
   }
  }
 }

 private async getTokens(userId: number) {
  const data = { id: userId }

  const accessToken = this.jwt.sign(data, {
   expiresIn: 60
  })

  const refreshToken = this.jwt.sign(data, {
   expiresIn: '70d'
  })

  return { accessToken, refreshToken }
 }
 private returnUserFields(user: Partial<User>) {
  return {
   id: user.id,
   email: user.email,
   name:user.name,
   isAdmin: user.isAdmin
  }
 }

 private async validateUser(dto: AuthDto) {
  const user = await this.prismaService.user.findUnique({
   where: { email: dto.email }
  })
  if (!user) {
   throw new NotFoundException(NOT_FOUND)
  }
  else {
   const validated = await verify(user.password, dto.password)
   if (!validated) {
    throw new UnauthorizedException(INVALID_PASSWORD)
   }
   else {
    return user
   }
  }
 }
}
