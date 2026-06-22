import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AiStrategyResponse } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiStrategyService extends ApiService {
  generate(): Observable<AiStrategyResponse> {
    return this.post<AiStrategyResponse>('/ai-strategy/generate', {});
  }
}
