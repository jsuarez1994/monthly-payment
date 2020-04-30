// NGRX
import { ActionReducerMap } from '@ngrx/store';
// REDUCERS
import * as reducers from './reducers';
// INTERFACES
import { UserState } from './reducers/users/user.interface'
import { PaymentState } from './reducers/payments/payment.interface';
import { CategoryState } from './reducers/categories/category.interface';

export interface AppState {
  user: UserState;
  payments: PaymentState;
  categories: CategoryState;
}

export const appReducers: ActionReducerMap<AppState> = {
    user: reducers.userReducer,
    payments: reducers.paymentReducer,
    categories: reducers.categoryReducer
}
