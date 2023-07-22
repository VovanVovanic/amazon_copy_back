/* eslint-disable prettier/prettier */
import { JwtStrategy } from './jwt.strategy';
import { getJwtConfig } from './../config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService,JwtStrategy, UserService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:getJwtConfig
    }),
    UserModule
  ]
})
export class AuthModule {}
