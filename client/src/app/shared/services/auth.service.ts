import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../intefaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {}

  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('/api/login', user).pipe(tap(({token}) => {
      localStorage.setItem('auth-token', token);
      this.setToken(token);
    }));
  }

  register() {

  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
