import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  hide = true;
  message?: string;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}
  signup(user: any) {
    this.authService.signup(user).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/verifyOTP/' + user.email);
      },
      error: (err: any) => {
        this.message = err.error.message;
        this.message = this.message?.substring(34);
      },
    });
  }
}
