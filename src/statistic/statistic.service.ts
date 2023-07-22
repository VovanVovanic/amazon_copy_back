import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NOT_FOUND } from 'src/user/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async getStatystic() {
    try {
      const users = await this.prisma.user.count();
      const orders = await this.prisma.order.count();
      const reviews = await this.prisma.review.count();
      const total = await this.prisma.order.aggregate({
        _sum: { total: true },
      });

      return [
        { name: 'Users', value: users },
        { name: 'Orders', value: orders },
        { name: 'Reviews', value: reviews },
        { name: 'Total', value: total },
      ];
    } catch (e) {
      Logger.error(e);
      return e;
    }
  }
}
