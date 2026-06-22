import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CoolingPlan } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoolingPlanService extends ApiService {
  getAll(): Observable<CoolingPlan[]> {
    return this.get<CoolingPlan[]>('/cooling-plans');
  }

  adopt(data: Partial<CoolingPlan>): Observable<CoolingPlan> {
    return this.post<CoolingPlan>('/cooling-plans', data);
  }
}
