import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName!: string;
  dropdownOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authState$.subscribe((state) => {
      this.isLoggedIn = state;
    });
    this.authService.userNameState$.subscribe((name) => {
      this.userName = name;
    });

    if (this.authService.isCurrentlyAuthenticated()) {
      this.authService
        .getCurrentUser()
        .subscribe((user) => this.authService.updateUserName(user.firstName));
    }
  }
}
