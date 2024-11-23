import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../models/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/products';
  private productList$ = new BehaviorSubject<Product[]>([]);
  products$ = this.productList$.asObservable();

  constructor(private http: HttpClient) {}

  private addProduct(newProduct: Product): void {
    this.productList$.next([...this.productList$.value, newProduct]);
  }

  private removeProduct(id: string): void {
    this.productList$.next(
      this.productList$.value.filter((product) => product.id !== id)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  loadProductList(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => {
        this.productList$.next(products);
      },
      error: (err) => {
        console.error('Erro ao carregar os produtos:', err);
      },
    });
  }

  saveProduct(product: Product): Observable<void> {
    return this.http.post<void>(this.apiUrl, product).pipe(
      tap(() => {
        this.addProduct(product);
      })
    );
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.removeProduct(id)));
  }
}
