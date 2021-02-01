import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Finance } from '../intefaces';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<Finance[]> {
    return this.http.get<Finance[]>('/api/events');
  }

  getEventsById(id: string): Observable<Finance> {
    return this.http.get<Finance>(`/api/events/${id}`);
  }

  addEvent(event: Finance): Observable<Finance> {
    return this.http.post<Finance>('/api/events', event);
  }
}
