import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest, ServiceResponse } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://localhost:7146/api/products';

  constructor(private http: HttpClient) {}

  getAll(
    search?: string,
    page: number = 1,
    pageSize: number = 10,
    includeDeleted: boolean = false
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('includeDeleted', includeDeleted.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductRequest): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.apiUrl, product);
  }

  update(id: number, product: ProductRequest): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}

