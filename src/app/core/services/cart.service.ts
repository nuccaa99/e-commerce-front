import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  addToCart(id: string, q: number = 1): Observable<any[]> {
    return this.http
      .put<any[]>(`${this.apiUrl}/add-to-cart`, {
        productId: id,
        quantity: q,
      })
      .pipe(catchError(this.handleError));
  }

  removeFromCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/remove-from-cart`, {
        productId,
        quantity,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while processing your request';

    if (error.error?.message) {
      switch (error.error.message) {
        case 'Not enough product in stock':
          errorMessage =
            'Sorry, this item is out of stock or has insufficient quantity';
          break;
        case 'Product not found':
          errorMessage = 'This product is no longer available';
          break;
        case 'User not found':
          errorMessage = 'Please log in to continue';
          break;
        default:
          errorMessage = error.error.message;
      }
    }

    return throwError(() => errorMessage);
  }
}
