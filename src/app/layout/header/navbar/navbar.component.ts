import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName!: string;
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authState$.subscribe((state) => {
      this.isLoggedIn = state;
    });
    this.authService.userNameState$.subscribe((name) => {
      this.userName = name;
    });

    if (this.authService.isCurrentlyAuthenticated()) {
      this.authService
        .getCurrentUserName()
        .subscribe((user) => this.authService.updateUserName(user.firstName));
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.userName = '';
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
}
