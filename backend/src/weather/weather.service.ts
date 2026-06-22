import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async getForecast(days: number = 3): Promise<{ date: string; tempMax: number; tempMin: number; description: string }[]> {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (days - 1) * 86400000).toISOString().split('T')[0];

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          latitude: 39.9042,
          longitude: 116.4074,
          daily: 'temperature_2m_max,temperature_2m_min,weathercode',
          timezone: 'Asia/Shanghai',
          start_date: startDate,
          end_date: endDate,
        },
      });

      const daily = response.data.daily;
      const descriptions: Record<number, string> = {
        0: '晴', 1: '大部晴', 2: '多云', 3: '阴',
        45: '雾', 48: '雾凇', 51: '小毛毛雨', 53: '毛毛雨',
        55: '大毛毛雨', 61: '小雨', 63: '中雨', 65: '大雨',
        71: '小雪', 73: '中雪', 75: '大雪', 80: '阵雨',
        95: '雷暴', 96: '冰雹',
      };

      return daily.time.map((date: string, i: number) => ({
        date,
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        description: descriptions[daily.weathercode[i]] || '未知',
      }));
    } catch {
      return this.getMockForecast(days);
    }
  }

  private getMockForecast(days: number): { date: string; tempMax: number; tempMin: number; description: string }[] {
    const result = [];
    const descriptions = ['晴', '多云', '阴', '小雨'];
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() + i * 86400000).toISOString().split('T')[0];
      result.push({
        date,
        tempMax: 30 + Math.floor(Math.random() * 8),
        tempMin: 22 + Math.floor(Math.random() * 5),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
      });
    }
    return result;
  }
}
