import { Injectable, EventEmitter} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router }    from '@angular/router';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('X-Requested-With', 'XMLHttpRequest');

@Injectable()
export class AuthService {
    private static auth: AuthService;
    private _emitter: EventEmitter<any> = new EventEmitter();
    private _init: Promise<boolean>;
    private _user: any;
    private base_url = 'https://hitesh-batcave.herokuapp.com';

    constructor(private router: Router, private http: Http) {
      if (AuthService.auth) {
        throw new Error("AuthService service is already initialized.");
      }
      this.router = router;
      this.http = http;
      AuthService.auth = this;

      this._init = new Promise<boolean>((resolve, reject) => {
        this.http.get(this.base_url + "/auth/user")
          .map(res => res.json())
          .subscribe(data => {
              this._user = data.user;
              this.emit();
              resolve(true);
          }, reject);
      });
    }

    subscribe(next: (user: any) => void) : any {
      let listener = this._emitter.subscribe(next);
      next(this.user);
      return listener;
    }

    static check(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        function doCheck() {
          if (!AuthService.auth.user) {
            AuthService.auth.router.navigate(['/login']);
          }
          resolve(!!AuthService.auth.user);
        }
        AuthService.auth._init.then(doCheck, doCheck);
      });
    }

    static checkUnauth(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        function doCheck() {
          if (AuthService.auth.user) {
            AuthService.auth.router.navigate(['/home']);
          }
          resolve(!AuthService.auth.user);
        }
        AuthService.auth._init.then(doCheck, doCheck);
      });
    }

    get user() {
      return this._user;
    }


    login(username: string, password: string) {
      let body = JSON.stringify({ username, password });
      return new Promise<boolean>((resolve, reject) => {
        this.http.post(this.base_url + "/auth/login", body, { headers : contentHeaders })
          .map(res => res.json())
          .subscribe(data => {
            this._user = data.user;
            this.emit();
            return resolve();
          }, err => {
            console.log("login error", err);
            return reject();
          });
        });
    }

    logout() {
      this.http.get(this.base_url + "/auth/logout")
      .subscribe(res => {
        this._user = null;
        this.emit();
        this.router.navigate(['/login']);
      });
    }

    takeMeLogin() {
      this._user = null;
      this.emit();
      this.router.navigate(['/login']);
    }

    private emit() {
      this._emitter.emit(this.user);
    }
  }
