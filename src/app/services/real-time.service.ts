import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class RealTimeService {
  // public message$: BehaviorSubject<any> = new BehaviorSubject('');
  // public chat$: BehaviorSubject<any> = new BehaviorSubject('');

  token = localStorage.getItem('token');
  url: string = 'http://localhost:8000?token=' + this.token;

  private socket: Socket;
  constructor() {
    this.socket = io(this.url);
  }
  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public CreateChat(chat: any) {
    this.socket.emit('chat', chat);
  }

  public authenticated(data: any) {
    this.socket.emit('authenticated', data);
  }

  public getNewMessage(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('message', (data) => {
        subscriber.next(data);
      });
    });
  }

  public getNewChat(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('chat', (data) => {
        subscriber.next(data);
      });
    });
  }

  public updateSeen(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('seen', (data) => {
        subscriber.next(data);
      });
    });
  }
}
