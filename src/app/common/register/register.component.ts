import { Component, NgZone }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Chat } from '../../services/chat';
import { NgUploaderOptions } from 'ngx-uploader';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  private zone: NgZone;
  private options: any;
  private progress: number = 0;
  private response: any = {};

  private draft: any;
  private errorMessage: any;
  private info: string = "Please provide account details.";

  constructor(private auth: AuthService, private _chatService: Chat, private router: Router) {
    this.auth = auth;
    this.draft = {};
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.options = NgUploaderOptions;
    this.options = {
      url: 'https://hitesh-batcave.herokuapp.com/api/save/avatar',
      filterExtensions: false,
      allowedExtensions: ['image/png', 'image/jpg'],
      calculateSpeed: true,
      customHeaders: {
        'custom-header': 'value'
      },
    };
  }

  handleUpload(data: any): void {
    this.zone.run(() => {
      this.progress = Math.floor(data.progress.percent / 100);
    });
    let resp = data.response;
    if (resp) {
      resp = JSON.parse(resp);
      this.response = resp;
      this.draft.avatar = resp.filename;
    }
  }

  register(e: any) {
    e.preventDefault();
    var re = /\S+@\S+\.\S+/;
    if (!re.test(this.draft.email)) {
      this.errorMessage = "Invalid email address";
      return;
    };
    if (this.draft.password.length <= 3) {
      this.errorMessage = "Password too short ! Must be more than 5 characters";
      return;
    };
    if (this.draft.password === this.draft.confirmPassword) {
      this.errorMessage = "";
      this._chatService.saveUser(this.draft)
        .subscribe(res => {
          this.auth.login(this.draft.username, this.draft.password)
            .then(done => {
              this.info = "WOW ! You are done."
              $('.form').fadeOut(500);
              $('.wrapper').addClass('form-success');
              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 1500);
            })
            .catch(err => {
              this.errorMessage = "Invalid username or password !"
            });
        }, err => {
          if (err._body.includes("username_1")) {
            this.errorMessage = "Username already exists";
            return;
          }
          if (err._body.includes("email_1")) {
            this.errorMessage = "Email address already registered";
            return;
          }
        });
    } else {
      this.errorMessage = "Password does not matched !!";
    }
  }
}
