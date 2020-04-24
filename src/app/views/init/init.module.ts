import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// MODULES
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class InitModule { }
