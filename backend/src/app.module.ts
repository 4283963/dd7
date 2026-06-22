import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CoolingPlansModule } from './cooling-plans/cooling-plans.module';
import { WeatherModule } from './weather/weather.module';
import { AiStrategyModule } from './ai-strategy/ai-strategy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-room'),
    RoomsModule,
    ReservationsModule,
    CoolingPlansModule,
    WeatherModule,
    AiStrategyModule,
  ],
})
export class AppModule {}
