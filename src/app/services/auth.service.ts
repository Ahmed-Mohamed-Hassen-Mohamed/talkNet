import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://localhost:8000/';
  constructor(private http: HttpClient) {}
  signup(body: any) {
    return this.http.post(this.url + 'signUp', body);
  }
  signin(body: any) {
    console.log(body);

    return this.http.post(this.url + 'signIn', body);
  }
  sendEmail(body: any) {
    return this.http.post(this.url + 'sendEmail', body);
  }
  verifyOTP(body: any) {
    return this.http.post(this.url + 'verifyOTP', body);
  }
  updatePassword(body: any) {
    return this.http.patch(this.url + 'updatePassword', body);
  }
}
