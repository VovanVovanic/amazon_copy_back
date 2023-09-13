import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async getStatistic() {
    try {
      const users = await this.prisma.user.count();
      const orders = await this.prisma.order.count();
      const reviews = await this.prisma.review.count();
      const total = await this.prisma.order.aggregate({
        _sum: { total: true },
      });

      return [
        { name: 'Users in the system', value: users },
        { name: 'Orders made', value: orders },
        { name: 'Reviews left', value: reviews },
        { name: 'Total spent by all users', value: `$${total._sum.total}` },
      ];
    } catch (e) {
      Logger.error(e);
      return e;
    }
  }
}
