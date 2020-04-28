// NGRX
import { ActionReducerMap } from '@ngrx/store';
// REDUCERS
import * as reducers from './reducers';
// INTERFACES
import { UserState } from './reducers/users/user.interface'
import { PaymentState } from './reducers/payments/payment.interface';

export interface AppState {
  user: UserState;
  payments: PaymentState;
}

export const appReducers: ActionReducerMap<AppState> = {
    user: reducers.userReducer,
    payments: reducers.paymentReducer
}
