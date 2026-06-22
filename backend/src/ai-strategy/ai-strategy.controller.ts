import { Controller, Post } from '@nestjs/common';
import { AiStrategyService, CoolingStrategy } from './ai-strategy.service';

interface GenerateResponse {
  strategies: CoolingStrategy[];
  weather: { date: string; tempMax: number; tempMin: number; description: string }[];
  reservationSummary: { date: string; roomId: string; count: number }[];
}

@Controller('api/ai-strategy')
export class AiStrategyController {
  constructor(private readonly aiStrategyService: AiStrategyService) {}

  @Post('generate')
  async generate(): Promise<GenerateResponse> {
    return this.aiStrategyService.generateStrategies();
  }
}
