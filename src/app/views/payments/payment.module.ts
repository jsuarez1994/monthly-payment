// DEFEAT
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MODULES
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { PrimeModule } from './prime.module';

// COMPONENTS
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { PaymentStatisticsComponent } from './payment-statistics/payment-statistics.component';
import { HistoryPaymentComponent } from './history-payment/history-payment.component';
import { ConfigUserComponent } from './config-user/config-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    PaymentStatisticsComponent,
    PaymentComponent,
    DashboardComponent,
    HistoryPaymentComponent,
    ConfigUserComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    PrimeModule
  ],
})
export class PaymentModule {}
