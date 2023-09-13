/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
      jsonWebTokenOptions: {
        ignoreNotBefore: true,
        ignoreExpiration: false,
      },
    });
  }
  async validate({ id }: Pick<User, "id">) {
    return this.prismaService.user.findUnique({ where: { id: +id } });
  }
}
