import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MODULES
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
// COMPONENTS
import { ConfigUserComponent } from './config-user/config-user.component';


@NgModule({
  declarations: [ConfigUserComponent],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class UserModuleModule { }
