// DEFEAT
import { NgModule } from '@angular/core';
// ROUTE
import { Routes, RouterModule } from '@angular/router';
// ROUTE CHILDREN
import { dashboardRoutes } from './dashboard.routes';
// CONSTANTS
import { Constants } from '../../shared/Utils/constants';
// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: Constants.DASHBOARD_PATH,
    component: DashboardComponent,
    children: dashboardRoutes,
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
