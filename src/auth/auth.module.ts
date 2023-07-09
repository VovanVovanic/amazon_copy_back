import { getJwtConfig } from './../config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:getJwtConfig
    })
  ]
})
export class AuthModule {}
