import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Room } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomService extends ApiService {
  getRooms(): Observable<Room[]> {
    return this.get<Room[]>('/rooms');
  }
}
