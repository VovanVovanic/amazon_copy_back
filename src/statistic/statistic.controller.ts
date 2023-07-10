import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Get(":userId")
  @Auth()
  async getStatystic(@Param("userId") userId: string) {
    return this.statisticService.getStatystic(+userId)
  }
}
