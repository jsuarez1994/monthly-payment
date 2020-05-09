// ROUTES
import { Routes } from '@angular/router';
// CONSTANTS
import { Constants } from '../../shared/Utils/constants';
// COMPONENTS
import { PaymentComponent } from '../payments/payment/payment.component';
import { PaymentStatisticsComponent } from '../payments/payment-statistics/payment-statistics.component';
import { AddPaymentComponent } from '../payments/add-payment/add-payment.component';
import { CategoryComponent } from '../payments/category/category.component';
import { AddCategoryComponent } from '../payments/add-category/add-category.component';
import { UpdatePaymentComponent } from '../payments/update-payment/update-payment.component';
import { HistoryPaymentComponent } from '../payments/history-payment/history-payment.component';
import { UpdateCategoryComponent } from '../payments/update-category/update-category.component';
import { ConfigUserComponent } from '../user/config-user/config-user.component';


export const dashboardRoutes: Routes = [
    { path: Constants.DASHBOARD_PATH, component: PaymentComponent },
    { path: Constants.PAYMENTS_STATISTICS_PATH, component: PaymentStatisticsComponent },
    { path: Constants.ADD_PAYMENTS_PATH, component: AddPaymentComponent },
    { path: Constants.UPDATE_PAYMENTS_PATH, component: UpdatePaymentComponent },
    { path: Constants.HISTORY_PAYMENT_PATH, component: HistoryPaymentComponent },
    { path: Constants.CATEGORIES_PATH, component: CategoryComponent },
    { path: Constants.ADD_CATEGORIES_PATH, component: AddCategoryComponent },
    { path: Constants.UPDATE_CATEGORIES_PATH, component: UpdateCategoryComponent },
    { path: Constants.CONFIG_USER_PATH, component: ConfigUserComponent }
];
