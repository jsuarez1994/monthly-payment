import { NgModule } from '@angular/core';
// ROUTES
import { Routes, RouterModule } from '@angular/router';
// COMPONENTS
import { LoginComponent } from './views/init/login/login.component';
import { RegisterComponent } from './views/init/register/register.component';
// CONSTANTS
import { Constants } from './shared/Utils/constants';
// SERVICE
import { AuthGuardService } from './services/auth-guard.service';
// MODULE
import { PaymentModule } from './views/payments/payment.module'; //NOT REMOVE

const routes: Routes = [
  { path: Constants.LOGIN_PATH, component: LoginComponent },
  { path: Constants.REGISTER_PATH, component: RegisterComponent },
  { 
    path: Constants.DASHBOARD_PATH, 
    loadChildren: './views/payments/payment.module#PaymentModule'
    //canLoad: [AuthGuardService]
  },
  { path: Constants.NOT_FOUND_PATH, redirectTo: Constants.DASHBOARD_PATH },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
