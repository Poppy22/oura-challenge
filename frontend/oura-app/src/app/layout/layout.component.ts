import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  opened = true;

  logoutUser() {
    this.auth.logout();
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
