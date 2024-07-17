import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = 'http://localhost:8000/';
  constructor(private http: HttpClient) {}
  getprofile() {
    return this.http.get(this.url + 'profile');
  }

  getUserByEmail(body: any) {
    return this.http.post(this.url + 'search', body);
  }

  updateUser(body: any) {
    return this.http.patch(this.url + 'users', body);
  }

}
