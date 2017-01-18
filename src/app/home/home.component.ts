import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AuthService } from '../services/auth/auth.service';
import { Chat } from '../services/chat';

import * as io from 'socket.io-client';
import * as _ from 'lodash';
import * as $ from 'jquery';

const rooms = {};

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent {
  _user: any;
  _users: any;
  _groups: any;
  _onlineUsers: any = [];
  draftMessage: any;
  currentThread: any;
  receiverId: any;
  searchUsers: any;
  searchDraft = new FormControl();
  textareaDraft = new FormControl();
  isSearchDraft: boolean = false;
  isLoadingUser: boolean = false;
  isTyping: boolean = false;
  colorSet: any = ['#ba6236', '#ae7313', '#a5980d', '#7d9726', '#5b9d48', '#36a166', '#9d6c7c', '#0e5a94', '#9d6c7c', '#5e6e5e'];
  homeImage: any = "https://hitesh-batcave.herokuapp.com/home_image.png";
  public socket = io.connect('https://hitesh-batcave.herokuapp.com');
  constructor(private auth: AuthService, private _chatService: Chat, public el: ElementRef) {
    auth.subscribe((user) => {
      this._user = user;
    });

    this.searchDraft.valueChanges
      .debounceTime(1500)
      .distinctUntilChanged()
      .subscribe(newValue => {
        if (newValue) {
          this.isSearchDraft = true;
          this.isLoadingUser = true;
          this._chatService.searchUser(newValue)
            .subscribe(res => {
              this.searchUsers = res.users;
              this.isLoadingUser = false;
            }, err => {
              if (err.status === 401) { this.auth.takeMeLogin(); }
            });
        } else {
          this.isSearchDraft = false;
        }
      });

    this.textareaDraft.valueChanges
      .debounceTime(2000)
      .distinctUntilChanged()
      .subscribe(newValue => {
        if (newValue) {
          let data = {
            roomId: this.currentThread.id,
            receiverId: this.receiverId,
            typing: true
          };
          this.socket.emit("on:typing-message", data);
        } else {
          this.isTyping = false;
        }
      });

    this.socket.emit("on:login", this._user.id);

    this.socket.on("on:login", (data: any) => {
      this._onlineUsers = data;
    });

    this.socket.on("on:send-message", (data: any) => {
      let roomId = data.roomId;
      let room = rooms[roomId];
      let senderId = data.senderId;
      if (!room) {
        rooms[roomId] = {
          unread:0,
          messages: [ data ],
          roomId: roomId,
          people: [ data.senderId, data.receiverId ]
        };
      }
      if (rooms[roomId]) {
        rooms[roomId].messages.push(data);
      }
      if (this.currentThread) {
        this.scrollToBottom();
        if (String(roomId) !== String(this.currentThread.id)) {
          rooms[roomId].unread = rooms[roomId].unread + 1;
        }
      } else {
        rooms[roomId].unread = rooms[roomId].unread + 1;
      }
      let index = this._users.indexOf(this._users.filter((el: any) => {
        return (String(el.id) === String(senderId));
      })[0]);
      if (index === -1) {
        let newUser = {
          avatar: data.senderAvatar,
          id: data.senderId,
          fullName: data.senderName
        }
        this._users.unshift(newUser);
      }
    });

    this.socket.on("on:is-typing", (data: any) => {
      if (data.typing) {
        this.isTyping = true;
        this.scrollToBottom();
      } else {
        this.isTyping = false;
      }
    });

    this.socket.on("on:joined-room", (data: any) => {
      let roomId = data.roomId;
      let room = rooms[roomId];
      if (!room) {
        rooms[roomId] = data;
        rooms[roomId].unread = 0;
      }
      if (room) {
        room.messages = data.messages;
        room.unread = 0;
      }
    });

    this.socket.on("on:joined-group-room", (data: any) => {
      let roomId = data.roomId;
      let room = rooms[roomId];
      if (!room) {
        rooms[roomId] = data;
      }
      if (room) {
        rooms[roomId].messages = data.messages;
      }
    });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  get user() : any {
    return this._user;
  }

  get users() : any {
    return this._users;
  }

  get groups() : any {
    return this._groups;
  }

  get messages() : any {
    if (!rooms[this.currentThread.id]) {
      return [];
    }
    return rooms[this.currentThread.id].messages;
  }

  isOnline(user: any) : any {
    return this._onlineUsers.includes(user);
  }

  getUnreadMessages(userId: any) {
    let unread:any = null;
    for (let room in rooms) {
      let people = rooms[room].people;
      if (people.includes(userId) && people.includes(this._user.id) && rooms[room].unread !== 0) {
        return rooms[room].unread;
      }
    }
    return unread;
  }

  selectSearchUser(e: Event, user: any) {
    let index = this._users.indexOf(this._users.filter((el: any) => {
      return (String(el.id) === String(user.id));
    })[0]);
    if (index === -1) {
      this._users.unshift(user);
    }
    this.selectThread(e, user);
    this.isSearchDraft = false;
  }

  selectThread(event: any, thread: any) {
    event.preventDefault();
    this.receiverId = thread.id;
    let people = {
      sender: this._user.id,
      receiver: thread.id
    };
    this._chatService.getThread(people)
      .subscribe(res => {
        this.currentThread = {
          id: res.thread.id,
          avatar: thread.avatar,
          fullName: thread.fullName,
          people: res.thread.people
        };
        this.socket.emit("on:join-room", this.currentThread);
      }, err => {
        if (err.status === 401) { this.auth.takeMeLogin(); }
      });
  }

  selectGroup(event: any, thread: any) {
    event.preventDefault();
    this.currentThread = {
      id: thread.id,
      avatar: thread.avatar,
      fullName: thread.name
    };
    this.socket.emit("on:join-group-room", this.currentThread);
  }

  onEnter(event: any): void {
    event.preventDefault();
    let data = {
      roomId: this.currentThread.id,
      receiverId: this.receiverId,
      typing: false
    };
    this.socket.emit("on:typing-message", data);
    let today = new Date().toISOString();
    let random = Math.floor(Math.random() * 10);
    if (!this.draftMessage) {
      return;
    }
    let id1 = this.currentThread.people[0];
    let id2 = this.currentThread.people[1];
    let rid = id1 === this._user.id ? id2 :  id1;
    if (this.currentThread) {
      let message = {
        roomId: this.currentThread.id,
        senderId: this._user.id,
        senderName: this._user.fullName,
        senderAvatar: this._user.avatar,
        receiverId: rid,
        text: this.draftMessage,
        sentAt: today,
        meta: this.colorSet[random]
      };
      this.draftMessage = null;
      if (rooms[this.currentThread.id]) {
        rooms[this.currentThread.id].messages.push(message);
        this.scrollToBottom();
      }
      this.socket.emit("on:send-message", message);
    }
  }

  getAllUsers() {
    this.isLoadingUser = true;
    this._chatService.getUsers()
      .subscribe(res => {
        this._users = res.users;
        this.isLoadingUser = false;
      }, err => {
        if (err.status === 401) { this.auth.takeMeLogin(); }
      });
  }

  scrollToBottom(): void {
    var $t = $('#chat-history');
    $t.animate({"scrollTop": $('#chat-history')[0].scrollHeight}, "swing");
  }

  logout(e: Event) {
    e.preventDefault();
    this.socket.emit("on:logout", this._user.id);
    this.auth.logout();
  }
}
