import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  hide = true;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  codes: string[] = ['', '', '', ''];
  showUpdate = false;
  ngOnInit(): void {
    const inputElement = document.querySelector(
      `input.code:nth-child(${1})`
    ) as HTMLInputElement;
    inputElement.focus();
  }
  isValidKey(event: KeyboardEvent): boolean {
    const key = event.key;
    return (key >= '0' && key <= '9') || key === 'Backspace';
  }
  _codes: number[] = [];
  onKeyDown(event: KeyboardEvent, index: number) {
    if (!this.isValidKey(event)) {
      event.preventDefault();
      return;
    }
    if (event.key >= '0' && event.key <= '9') {
      this._codes.splice(index, 1, Number(event.key));
      setTimeout(() => {
        const nextIndex = index + 1;
        if (nextIndex < this.codes.length) {
          const inputElement = document.querySelector(
            `input.code:nth-child(${nextIndex + 1})`
          ) as HTMLInputElement;
          inputElement.focus();
        }
      }, 10);
    } else if (event.key === 'Backspace' && index > 0) {
      this._codes.splice(index, 1);
      setTimeout(() => {
        const previousIndex = index - 1;
        const inputElement = document.querySelector(
          `input.code:nth-child(${previousIndex + 1})`
        ) as HTMLInputElement;
        inputElement.focus();
      }, 10);
    }
  }
  email: any;
  verifyOTP(value: any) {
    const data = {
      email: this.email,
      otp: '' + value.code0 + value.code1 + value.code2 + value.code3,
    };
    this.authService.verifyOTP(data).subscribe({
      next: (res: any) => {
        this.showUpdate = true;
      },
    });
  }

  sendEmail(value: any) {
    this.authService.sendEmail({ email: value.email }).subscribe({
      next: (res: any) => {
        this.email = value.email;
      },
    });
  }
  updatePassword(value: any) {
    const data = {
      email: this.email,
      password: value.password
    }
    this.authService.updatePassword(data).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/signin');
      },
    });
  }
}
