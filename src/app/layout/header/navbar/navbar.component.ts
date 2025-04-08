import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName!: string;
  dropdownOpen = false;
  basketQuantity: number = 0;

  error: string | null = null;
  isLoading: boolean = false;

  private authSubscription!: Subscription;
  private userNameSubscription!: Subscription;
  private cartChangedSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}
  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe((state) => {
      this.isLoggedIn = state;
      if (state) {
        // Update cart when logged in
        this.updateCartQuantity();
      } else {
        // Reset basket quantity when logged out
        this.basketQuantity = 0;
      }
    });

    this.userNameSubscription = this.authService.userNameState$.subscribe(
      (name) => {
        this.userName = name;
      }
    );

    // Subscribe to cart changes
    this.cartChangedSubscription = this.cartService.cartChanged$.subscribe(
      (changed) => {
        if (changed && this.isLoggedIn) {
          this.updateCartQuantity();
        }
      }
    );

    if (this.authService.isCurrentlyAuthenticated()) {
      this.authService
        .getCurrentUser()
        .subscribe((user) => this.authService.updateUserName(user.firstName));

      // Initial cart load
      this.updateCartQuantity();
    }
  }

  private updateCartQuantity(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.cart) {
          // Sum up the quantities of all items in the cart
          console.log(user.cart, 'cart');
          this.basketQuantity = user.cart.reduce(
            (total: any, item: { quantity: any }) =>
              total + (Number(item.quantity) || 1),
            0
          );
        } else {
          this.basketQuantity = 0;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load basket';
        console.error('Error loading basket:', err);
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
    if (this.cartChangedSubscription) {
      this.cartChangedSubscription.unsubscribe();
    }
  }
}
