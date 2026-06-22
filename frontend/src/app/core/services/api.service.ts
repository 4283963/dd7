import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(path: string, params?: any) {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  protected post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  protected delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
