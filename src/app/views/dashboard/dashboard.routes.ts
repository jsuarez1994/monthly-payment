// ROUTES
import { Routes } from '@angular/router';
// CONSTANTS
import { Constants } from '../../shared/Utils/constants';
// COMPONENTS
import { PaymentComponent } from '../payments/payment/payment.component';
import { PaymentStatisticsComponent } from '../payments/payment-statistics/payment-statistics.component';
import { AddPaymentComponent } from '../payments/add-payment/add-payment.component';


export const dashboardRoutes: Routes = [
    { path: Constants.DASHBOARD_PATH, component: PaymentComponent },
    { path: Constants.PAYMENTS_STATISTICS_PATH, component: PaymentStatisticsComponent },
    { path: Constants.ADD_PAYMENTS_PATH, component: AddPaymentComponent },
];