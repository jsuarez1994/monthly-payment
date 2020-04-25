import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// MODULES
import { SharedModule } from '../../shared/shared.module';

// FIREBASE
import { AngularFireAuthModule } from 'angularfire2/auth';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularFireAuthModule
  ]
})
export class InitModule { }
