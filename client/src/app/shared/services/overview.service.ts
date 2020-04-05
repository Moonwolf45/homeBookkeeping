import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

import { User } from '../intefaces';


@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  constructor(private http: HttpClient) {}

  getBill(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  getCurrency(): Observable<any> {
    return from(fetch('https://www.cbr-xml-daily.ru/daily_json.js', {mode: 'cors'}).then(res => {
      return res.json();
    }).catch(e => {
      console.log(e);
    }));
  }
}
