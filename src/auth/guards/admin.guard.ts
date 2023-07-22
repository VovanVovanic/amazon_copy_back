import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { NOT_AN_ADMIN } from '../constants';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    if (!request.user.isAdmin) throw new ForbiddenException(NOT_AN_ADMIN);
    return request.user.isAdmin;
  }
}
