import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartClicked = new EventEmitter<Product>();
  @Output() viewDetailsClicked = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onAddToCart(): void {
    if (this.authService.isCurrentlyAuthenticated()) {
      console.log(this.product);
      this.addToCartClicked.emit(this.product);
    } else {
      this.snackBar.open('Please log in to add items to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/auth/login']);
    }
  }

  onViewDetails(): void {
    this.viewDetailsClicked.emit(this.product._id);
  }
}
