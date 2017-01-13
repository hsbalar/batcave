import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

import * as $ from 'jquery';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent {

  error = false;
  signing = false;
  errorMessage: any;

  constructor(public authService: AuthService, public router: Router) {

  }

  login(e: Event, username: string, password: string) {
    e.preventDefault();
    this.signing = true;
    this.authService.login(username, password).then( res => {
      this.error = this.signing = false;
      $('.form').fadeOut(500);
      $('.wrapper').addClass('form-success');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    }, err => {
      this.errorMessage = "Invalid username or password !"
      this.error = true;
      this.signing = false;
    });
  }

  logout() {
    this.authService.logout();
  }
}
