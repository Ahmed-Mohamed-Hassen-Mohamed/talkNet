import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  logo: string = './assets/images/chat.png';
  constructor() { }
}
