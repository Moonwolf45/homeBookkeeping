import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../intefaces';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/categories/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>('/api/categories/', category);
  }

  editCategory(category: Category): Observable<Category> {
    return this.http.patch<Category>(`/api/categories/${category._id}`, category);
  }
}
