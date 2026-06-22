import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ReservationsService } from '../reservations/reservations.service';
import { WeatherService } from '../weather/weather.service';

export interface CoolingStrategy {
  room: string;
  schedule: { on: string; off: string };
  temperature: number;
  reasoning: string;
}

@Injectable()
export class AiStrategyService {
  constructor(
    private reservationsService: ReservationsService,
    private weatherService: WeatherService,
    private configService: ConfigService,
  ) {}

  async generateStrategies(): Promise<{
    strategies: CoolingStrategy[];
    weather: { date: string; tempMax: number; tempMin: number; description: string }[];
    reservationSummary: { date: string; roomId: string; count: number }[];
  }> {
    const today = new Date();
    const endDate = new Date(today.getTime() + 2 * 86400000);
    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const [weather, reservationSummary] = await Promise.all([
      this.weatherService.getForecast(3),
      this.reservationsService.countByDateRange(startDateStr, endDateStr),
    ]);

    const strategies = await this.callLLM(weather, reservationSummary);

    return { strategies, weather, reservationSummary };
  }

  private async callLLM(
    weather: { date: string; tempMax: number; tempMin: number; description: string }[],
    reservationSummary: { date: string; roomId: string; count: number }[],
  ): Promise<CoolingStrategy[]> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || this.configService.get<string>('OPENAI_API_KEY');
    const apiBaseUrl = this.configService.get<string>('LLM_API_BASE_URL') || 'https://api.deepseek.com';
    const modelName = this.configService.get<string>('LLM_MODEL') || 'deepseek-chat';

    const systemPrompt = `你是一个智能空调节能顾问。根据未来3天的天气预报和自习室预约人数，为每个房间生成空调定时开关和温度设定建议。
你必须只返回一个JSON数组，不要返回任何其他文字。格式如下：
[
  {
    "room": "房间名",
    "schedule": { "on": "HH:MM", "off": "HH:MM" },
    "temperature": 26,
    "reasoning": "简要说明理由"
  }
]`;

    const userPrompt = `天气预报：${JSON.stringify(weather)}
预约统计：${JSON.stringify(reservationSummary)}
请为每个房间生成空调节能策略。`;

    if (!apiKey) {
      return this.getMockStrategies();
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/chat/completions`,
        {
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getMockStrategies();
    } catch {
      return this.getMockStrategies();
    }
  }

  private getMockStrategies(): CoolingStrategy[] {
    return [
      { room: 'A101', schedule: { on: '08:30', off: '12:00' }, temperature: 25, reasoning: '上午预约人数较多，建议提前开启空调' },
      { room: 'A101', schedule: { on: '14:00', off: '18:00' }, temperature: 26, reasoning: '下午高温时段，保持舒适温度' },
      { room: 'A102', schedule: { on: '08:00', off: '21:00' }, temperature: 26, reasoning: '全天预约较满，持续开启' },
      { room: 'B201', schedule: { on: '09:00', off: '15:00' }, temperature: 27, reasoning: '预约人数适中，适当调高温度节能' },
      { room: 'B202', schedule: { on: '00:00', off: '00:00' }, temperature: 0, reasoning: '当前维护中，不建议开启空调' },
    ];
  }
}
