import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = { username: '', password: '' };

  loginUser() {
    this.auth.login(this.loginData);
  }

  logoutUser() {
    this.auth.logout();
  }

  test() {
    this.auth.test();
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
