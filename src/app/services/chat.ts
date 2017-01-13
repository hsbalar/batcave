import { Injectable, EventEmitter} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('X-Requested-With', 'XMLHttpRequest');

@Injectable()
export class Chat {
  base_url = 'https://hitesh-batcave.herokuapp.com';
  constructor(private http: Http) {

  }

  getUsers() {
    return this.http.get(this.base_url + "/chat/users")
      .map(res => res.json());
  }

  getGroups() {
    return this.http.get(this.base_url + "/chat/groups")
      .map(res => res.json());
  }

  getThread(people: any) {
    return this.http.post(this.base_url + "/chat/thread", JSON.stringify(people), { headers: contentHeaders })
      .map(res => res.json());
  }

  saveUser(data: any) {
    return this.http.post(this.base_url + "/api/save/user", JSON.stringify(data), { headers: contentHeaders })
      .map(res => res.json());
  }

  searchUser(searchDraft: any) {
    return this.http.post(this.base_url + "/chat/search/user", JSON.stringify({searchDraft: searchDraft }), { headers: contentHeaders })
      .map(res => res.json());
  }
}
