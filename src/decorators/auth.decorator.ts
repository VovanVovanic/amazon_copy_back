import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleType } from 'src/auth/types';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

export const Auth = (role: RoleType) =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(AdminGuard, JwtAuthGuard)
      : UseGuards(JwtAuthGuard),
  );
