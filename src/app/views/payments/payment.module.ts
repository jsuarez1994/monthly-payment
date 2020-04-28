// DEFEAT
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// COMPONENTS
import { PaymentStatisticsComponent } from './payment-statistics/payment-statistics.component';
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
// MODULES
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';

@NgModule({
  declarations: [
    PaymentStatisticsComponent,
    PaymentComponent,
    DashboardComponent,
    AddPaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
})
export class PaymentModule {}
