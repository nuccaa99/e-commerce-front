import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { loginDto, registerDto } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private authState = new BehaviorSubject<boolean>(this.hasToken());
  private userNameState = new BehaviorSubject<string>('');
  authState$ = this.authState.asObservable();
  userNameState$ = this.userNameState.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  register(registerData: registerDto): Observable<any> {
    const formData = new FormData();

    formData.append('firstName', registerData.firstName);
    formData.append('lastName', registerData.lastName);
    formData.append('email', registerData.email);
    formData.append('password', registerData.password);

    return this.http.post(`${this.apiUrl}/auth/sign-up`, formData);
  }

  updateUserName(name: string): void {
    this.userNameState.next(name);
  }

  login(loginData: loginDto): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/sign-in`, {
        email: loginData.email,
        password: loginData.password,
      })
      .pipe(
        tap((response: any) => {
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
          if (response.accessToken) {
            this.cookieService.set(
              'authToken',
              response.accessToken,
              expiryDate,
              '/',
              '',
              true,
              'Strict'
            );
            this.authState.next(true);
            this.getCurrentUser().subscribe((user) =>
              this.updateUserName(user.firstName)
            );
          }
        })
      );
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this.authState.next(false);
    this.updateUserName('');
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/current-user`);
  }

  isCurrentlyAuthenticated(): boolean {
    return this.authState.value;
  }

  private hasToken(): boolean {
    return this.cookieService.check('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
