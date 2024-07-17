import { Component } from '@angular/core';
import { BehaviorService } from 'src/app/services/behavior.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent {
  user: any;
  hide = true;
  defaultDate: string = '';
  constructor(
    private userService: UserService,
    private behaviorService: BehaviorService
  ) {}
  ngOnInit() {
    this.getProfile();
    this.behaviorService.updateNavbar(4);
  }
  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  getProfile() {
    this.userService.getprofile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.defaultDate = res.birthDate.slice(0, 10);
      },
    });
  }
  files: any;
  image: any;
  handelUpload(event: any) {
    this.files = event.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(this.files[0]);
    const data = new FormData();
    data.append('profile', this.files[0]);
    this.updateInfo(data);
  }
  showMessage = false;
  updateInfo(value: any) {
    this.userService.updateUser(value).subscribe({
      next: (res: any) => {
        this.user = res;
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 2000);
      },
    });
  }
}
