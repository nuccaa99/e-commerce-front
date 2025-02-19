import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  orderHistory: any[] = [];
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.orderHistory = user.orderHistory || [];
        console.log('Order history:', this.orderHistory);
      },
      error: (err) => {
        this.error = 'Failed to load order history';
        console.error('Error loading order history:', err);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
