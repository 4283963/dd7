import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CoolingPlansModule } from './cooling-plans/cooling-plans.module';
import { WeatherModule } from './weather/weather.module';
import { AiStrategyModule } from './ai-strategy/ai-strategy.module';
import { AcControlLogModule } from './ac-control-log/ac-control-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-room'),
    ScheduleModule.forRoot(),
    RoomsModule,
    ReservationsModule,
    CoolingPlansModule,
    WeatherModule,
    AiStrategyModule,
    AcControlLogModule,
  ],
})
export class AppModule {}
