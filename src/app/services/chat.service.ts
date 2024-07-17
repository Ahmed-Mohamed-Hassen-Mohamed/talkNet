import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url: string = 'http://localhost:8000/';
  constructor(private http: HttpClient) {}
  getChats() {
    return this.http.get(this.url + 'chats');
  }
  getChatById(id: any) {
    return this.http.get(this.url + 'chats/' + id);
  }
  getMessages(id: any) {
    console.log(id);
    return this.http.get(this.url + 'messages/' + id);
  }
  getLastMessages() {
    return this.http.get(this.url + 'lastMessages');
  }
  updateSeen(id: any) {
    return this.http.patch(this.url + 'seen/' + id, {});
  }
}
