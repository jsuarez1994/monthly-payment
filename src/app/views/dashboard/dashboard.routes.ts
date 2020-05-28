// ROUTES
import { Routes } from '@angular/router';
// CONSTANTS
import { Constants } from '../../shared/Utils/constants';
// COMPONENTS
import { PaymentComponent } from '../payments/payment/payment.component';
import { PaymentStatisticsComponent } from '../payments/payment-statistics/payment-statistics.component';
import { CategoryComponent } from '../payments/category/category.component';
import { HistoryPaymentComponent } from '../payments/history-payment/history-payment.component';
import { ConfigUserComponent } from '../payments/config-user/config-user.component';
import { ResetPasswordComponent } from '../payments/reset-password/reset-password.component';


export const dashboardRoutes: Routes = [
    { path: Constants.DASHBOARD_PATH, component: PaymentComponent },
    { path: Constants.PAYMENTS_STATISTICS_PATH, component: PaymentStatisticsComponent },
    { path: Constants.HISTORY_PAYMENT_PATH, component: HistoryPaymentComponent },
    { path: Constants.CATEGORIES_PATH, component: CategoryComponent },
    { path: Constants.CONFIG_USER_PATH, component: ConfigUserComponent },
    { path: Constants.RESET_PASSWORD_PATH, component: ResetPasswordComponent }
];
