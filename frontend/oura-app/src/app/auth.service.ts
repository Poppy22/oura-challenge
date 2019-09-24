import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url = {
    register: environment.baseUrl + '/register',
    login: environment.baseUrl + '/login',
    logout: environment.baseUrl + '/logout',
    tokenRefresh: environment.baseUrl + '/token/refresh'
  };

  public ACCESS_TOKEN = 'access_token';
  public REFRESH_TOKEN = 'refresh_token';

  private urlsNeedRefresh = [this.url.logout, this.url.tokenRefresh];

  constructor(private http: HttpClient, private router: Router) { }

  login(user: { username: string, password: string }) {
    return this.http.post<any>(this.url.login, user)
      .subscribe(
        res => {
          localStorage.setItem(this.ACCESS_TOKEN, res.data.access_token);
          localStorage.setItem(this.REFRESH_TOKEN, res.data.refresh_token);
          this.router.navigate(['']);
        },
        err => console.error(err)
      );
  }

  logout() {
    return this.http.post<any>(this.url.logout, {})
      .subscribe(
        res => {
          this.removeTokens();
          console.log('logged out');
        },
        err => console.error(err)
      );
  }

  refreshToken() {
    return this.http.post<any>(this.url.tokenRefresh, {})
      .pipe(tap((res) => {
        localStorage.setItem(this.ACCESS_TOKEN, res.data.access_token);
      }));
  }

  getToken(url: string) {
    if (this.urlsNeedRefresh.includes(url)) {
      return this.getRefreshToken();
    }
    return this.getAccessToken();
  }

  loggedIn() {
    return !!localStorage.getItem(this.ACCESS_TOKEN);
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
