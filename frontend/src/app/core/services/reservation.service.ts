import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Reservation } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservationService extends ApiService {
  getByDate(date: string): Observable<Reservation[]> {
    return this.get<Reservation[]>('/reservations', { date });
  }

  create(data: Partial<Reservation>): Observable<Reservation> {
    return this.post<Reservation>('/reservations', data);
  }

  cancel(id: string): Observable<Reservation> {
    return this.delete<Reservation>(`/reservations/${id}`);
  }
}
