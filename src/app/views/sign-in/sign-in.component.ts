import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorService } from 'src/app/services/behavior.service';
import { RealTimeService } from 'src/app/services/real-time.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  hide = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private realTimeService: RealTimeService,
    private behaviorService: BehaviorService,
    private router: Router
  ) {}
  image: string = '/assets/image/WhatsApp Image 2022-12-16 at 5.44.43 PM.jpeg';

  ngOnInit(): void {}

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  onSubmit(data: any) {
    this.login(data);
  }

  invalidLogin: boolean = false;
  EMLogin?: string;
  login(user: any) {
    this.authService.signin(user).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.behaviorService.updateData('.');
        this.realTimeService.authenticated({ token: res.token });
        this.router.navigateByUrl('/');
      },
      error: (err: any) => {
        if (err.error) {
          this.invalidLogin = true;
        }
      },
    });
  }
}
