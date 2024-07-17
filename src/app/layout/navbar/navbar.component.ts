import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorService } from 'src/app/services/behavior.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  logo = this.globalService.logo;
  link?: any;
  constructor(
    private behaviorService: BehaviorService,
    private globalService:GlobalService,
    private router: Router
  ) {
    this.behaviorService.navbar$.subscribe((value) => {
      this.link = value;
    });
  }
  logout() {
    localStorage.removeItem('token');
    this.behaviorService.updateData('.');
    this.router.navigateByUrl('/signin');
  }
}
