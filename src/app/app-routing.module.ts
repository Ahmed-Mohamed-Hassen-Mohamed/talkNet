import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { HomeComponent } from './views/home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ConnectionComponent } from './views/connection/connection.component';
import { ChatComponent } from './views/chat/chat.component';
import { VerifyOTPComponent } from './views/verify-otp/verify-otp.component';
import { SettingComponent } from './views/setting/setting.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'chats', component: ConnectionComponent, canActivate: [AuthGuardService] },
  { path: 'messages/:id', component: ChatComponent, canActivate: [AuthGuardService] },
  { path: 'settings', component: SettingComponent, canActivate: [AuthGuardService] },
  { path: 'verifyOTP/:email', component: VerifyOTPComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
