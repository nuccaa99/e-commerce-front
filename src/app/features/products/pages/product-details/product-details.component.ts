import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  productId!: string;
  isLoading: boolean = true;
  quantity: number = 1;
  isAddingToCart: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.snackBar.open('Error loading product details', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          this.product = null;
          this.isLoading = false;
        },
      });
    }
  }

  onAddToCart() {
    if (!this.authService.isCurrentlyAuthenticated()) {
      this.snackBar.open('Please log in to add items to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['warning-snackbar'],
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.product) {
      return;
    }

    this.isAddingToCart = true;
    this.cartService.addToCart(this.product._id, this.quantity).subscribe({
      next: (response) => {
        this.snackBar.open('Product added to basket', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.isAddingToCart = false;
      },
      error: (error) => {
        this.snackBar.open(error, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
        this.isAddingToCart = false;
      },
    });
  }
}
