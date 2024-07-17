import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BehaviorService {
  private dataSubject = new BehaviorSubject<string>('');
  private navbarSubject = new BehaviorSubject<number>(1);
  constructor() {}

  data$ = this.dataSubject.asObservable();
  navbar$ = this.navbarSubject.asObservable();

  // Method to update the data
  updateData(newValue: any) {
    this.dataSubject.next(newValue);
  }

  updateNavbar(newValue: any) {
    this.navbarSubject.next(newValue);
  }
}
