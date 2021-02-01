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
  private username = null;
  private userId = null;
  private balanceRUB = null;
  private balanceUSD = null;
  private balanceEUR = null;

  constructor(private http: HttpClient) {}

  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string, balance: any}>('/api/login', user).pipe(tap(({token}) => {
      localStorage.setItem('auth-token', token);
      this.setToken(token);
    }));
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/register', user);
  }

  logout() {
    this.setToken(null);
    this.setBalanceRUB(0);
    this.setBalanceUSD(0);
    this.setBalanceEUR(0);
    localStorage.clear();
  }

  setToken(token: string) {
    this.token = token;

    let userObj = null;
    if (token !== null) {
      userObj = atob(token.split('.')[1]);
    }
    this.setUsername(userObj);
    this.setUserId(userObj);
    this.setBalance(userObj);
  }

  getToken(): string {
    return this.token;
  }

  setUsername(user: string) {
    if (user === null) {
      this.username = '';
    } else {
      this.username = JSON.parse(user).username;
    }
  }

  getUsername() {
    return this.username;
  }

  setUserId(user: string) {
    if (user === null) {
      this.userId = '';
    } else {
      this.userId = JSON.parse(user).userId;
    }
  }

  getUserId() {
    return this.userId;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  setBalance(balance: string) {
    this.setBalanceRUB(JSON.parse(balance).balanceRUB);
    this.setBalanceUSD(JSON.parse(balance).balanceUSD);
    this.setBalanceEUR(JSON.parse(balance).balanceEUR);
  }

  setBalanceRUB(balanceRUB: number) {
      this.balanceRUB = balanceRUB;
  }

  getBalanceRUB() {
    return this.balanceRUB;
  }

  setBalanceUSD(balanceUSD: number) {
    this.balanceUSD = balanceUSD;
  }

  getBalanceUSD() {
    return this.balanceUSD;
  }

  setBalanceEUR(balanceEUR: number) {
    this.balanceEUR = balanceEUR;
  }

  getBalanceEUR() {
    return this.balanceEUR;
  }
}
