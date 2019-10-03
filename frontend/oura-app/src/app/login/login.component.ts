import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = { username: '', password: '' };
  registerData = { username: '', password: '' };
  newRegistration = false;

  loginUser() {
    this.auth.login(this.loginData);
  }

  registerUser() {
    this.auth.register(this.registerData);
  }

  toggleRegistration() {
    this.newRegistration = !this.newRegistration;
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
