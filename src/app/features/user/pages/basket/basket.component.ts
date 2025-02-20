import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  basket: any[] = [];
  basketProducts: any[] = [];
  error: string | null = null;
  isLoading: boolean = false;
  isCheckingOut: boolean = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.basket = user.cart || [];
        console.log(user);
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Failed to load basket';
        console.error('Error loading basket:', err);
      },
    });
  }

  removeFromBasket(productId: string, quantity: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.removeFromCart(productId, quantity).subscribe({
      next: (response) => {
        this.basket = response.data;
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Failed to remove item from basket';
        console.error('Error removing item:', err);
        this.isLoading = false;
      },
    });
  }
  checkout(): void {
    if (this.isCheckingOut || this.basketProducts.length === 0) return;

    this.isCheckingOut = true;
    this.error = null;

    this.cartService.checkout().subscribe({
      next: (response) => {
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.basket = [];
        this.basketProducts = [];
      },
      error: (err) => {
        this.error =
          typeof err === 'string' ? err : 'Failed to process checkout';
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
      complete: () => {
        this.isCheckingOut = false;
        this.router.navigate(['/']);
      },
    });
  }

  private async loadProducts(): Promise<void> {
    if (this.basket.length === 0) {
      this.isLoading = false;
      this.basketProducts = [];
      return;
    }

    this.isLoading = true;
    this.basketProducts = [];
    this.error = null;

    try {
      for (const item of this.basket) {
        const product = await this.productService
          .getProduct(item.productId)
          .toPromise();
        if (product) {
          this.basketProducts.push({
            ...product,
            quantity: Number(item.quantity),
          });
        }
      }
    } catch (err) {
      this.error = 'Failed to load product details';
      console.error('Error fetching products:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
