import { Module } from '@nestjs/common';
import { AiStrategyService } from './ai-strategy.service';
import { AiStrategyController } from './ai-strategy.controller';
import { ReservationsModule } from '../reservations/reservations.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [ReservationsModule, WeatherModule],
  controllers: [AiStrategyController],
  providers: [AiStrategyService],
  exports: [AiStrategyService],
})
export class AiStrategyModule {}
