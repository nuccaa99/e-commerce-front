import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  isAddingToCart: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onAddToCart(product: Product): void {
    if (this.authService.isCurrentlyAuthenticated()) {
      this.isAddingToCart = true;

      this.cartService.addToCart(product._id).subscribe({
        next: (response) => {
          console.log('Product added to cart:', response);
          this.snackBar.open('Product added to cart', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
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

  onViewDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
    console.log('Viewing details for:', productId);
  }
}
