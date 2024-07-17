import { Component } from '@angular/core';
import { BehaviorService } from 'src/app/services/behavior.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  logo = this.globalService.logo;
  constructor(
    private behaviorService: BehaviorService,
    private globalService: GlobalService
  ) {
    this.behaviorService.updateNavbar(1);
  }
}
