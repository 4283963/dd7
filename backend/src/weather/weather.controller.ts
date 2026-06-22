import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getForecast(@Query('days') days?: string): Promise<{ date: string; tempMax: number; tempMin: number; description: string }[]> {
    return this.weatherService.getForecast(days ? parseInt(days, 10) : 3);
  }
}
