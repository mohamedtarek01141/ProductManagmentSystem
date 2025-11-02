import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  createdAtUtc: string;
  updatedAtUtc?: string;
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'https://localhost:7146/api/products';

  constructor(private http: HttpClient) {}

  getAll(search?: string, page: number = 1, pageSize: number = 10, includeDeleted = false): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('includeDeleted', includeDeleted);
    if (search) params = params.set('search', search);
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, product);
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

