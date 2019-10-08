import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  confirmed = false;

  editAccount() {
    this.auth.editUser(this.userData.value)
      .subscribe(
        res => console.log(res),
        err => console.error(err)
      );
  }

  deleteAccount() {
    this.auth.deleteUser()
      .subscribe(
        res => {
          console.log(res);
          this.auth.removeTokens();
        },
        err => console.error(err)
      );
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getUser()
      .subscribe(
        res => {
          const data = res.data;
          this.userData.patchValue({
            name: data.name && data.name !== '' ? data.name : 'Jane Doe',
            username: data.username
          });
        },
        err => {
          this.userData.get('username').setErrors({ msg: err.error.msg });
        }
      );
  }

}
