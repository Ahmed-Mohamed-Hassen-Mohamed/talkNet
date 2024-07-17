import { Component } from '@angular/core';
import { RealTimeService } from './services/real-time.service';
import { BehaviorService } from './services/behavior.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TalkNet';
  token = localStorage.getItem('token');
  constructor(
    private realTimeService: RealTimeService,
    private behaviorService: BehaviorService
  ) {
    this.behaviorService.data$.subscribe((value) => {
      this.token = localStorage.getItem('token');
    });
  }
}
