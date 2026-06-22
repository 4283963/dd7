import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WeatherInfo } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService extends ApiService {
  getForecast(days: number = 3): Observable<WeatherInfo[]> {
    return this.get<WeatherInfo[]>('/weather', { days });
  }
}
