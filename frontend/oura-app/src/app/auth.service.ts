import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url = {
    all: environment.baseUrl + '/all_users',
    register: environment.baseUrl + '/register',
    login: environment.baseUrl + '/login',
    logout: environment.baseUrl + '/logout',
    tokenRefresh: environment.baseUrl + '/token/refresh'
  };

  public ACCESS_TOKEN = 'access_token';
  public REFRESH_TOKEN = 'refresh_token';

  private urlsNeedRefresh = [this.url.logout, this.url.tokenRefresh];
  private urlNoIntercept = [this.url.login];

  constructor(private http: HttpClient, private router: Router) { }

  register(user: { username: string, password: string }, callback: (err: any) => void) {
    return this.http.post<any>(this.url.register, user)
      .subscribe(
        res => this.saveTokens(res),
        err => callback(err)
      );
  }

  login(user: { username: string, password: string }, callback: (err: any) => void) {
    return this.http.post(this.url.login, user)
      .subscribe(
        res => this.saveTokens(res),
        err => callback(err)
      );
  }

  logout() {
    return this.http.post<any>(this.url.logout, {})
      .subscribe(
        res => {
          this.removeTokens();
        },
        err => console.error(err)
      );
  }

  refreshToken() {
    return this.http.post<any>(this.url.tokenRefresh, {})
      .pipe(tap(res => {
        localStorage.setItem(this.ACCESS_TOKEN, res.data.access_token);
      }));
  }

  /*** Utility functions ***/

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

  saveTokens(res) {
    localStorage.setItem(this.ACCESS_TOKEN, res.data.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, res.data.refresh_token);
    this.router.navigate(['']);
  }

  removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    this.router.navigate(['login']);
  }

  notIntercepted(url) {
    return !this.urlNoIntercept.includes(url);
  }
}
