import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  newRegistration = false;

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormControl(''),
  });

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
  });

  registerUser() {
    this.auth.register(this.registerForm.value, err => {
      this.registerForm.get('username').setErrors({ existingUsername: err.error.msg });
    });
  }

  loginUser() {
    this.auth.login(this.loginForm.value, err => {
      if (err.status === 404) {
        this.loginForm.get('username').setErrors({ usernameNotFound: err.error.msg });
      } else {
        this.loginForm.get('password').setErrors({ wrongPassword: err.error.msg });
      }
    });
  }

  toggleRegistration() {
    this.newRegistration = !this.newRegistration;
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
