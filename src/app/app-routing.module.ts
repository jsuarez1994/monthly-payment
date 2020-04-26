import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// COMPONENTS
import { LoginComponent } from './views/init/login/login.component';
import { RegisterComponent } from './views/init/register/register.component';
// CONSTANTS
import { Constants } from './shared/Utils/constants';

const routes: Routes = [
  { path: Constants.LOGIN_PATH, component: LoginComponent },
  { path: Constants.REGISTER_PATH, component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
