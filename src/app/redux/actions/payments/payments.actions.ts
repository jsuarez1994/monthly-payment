// NGRX
import { Action } from '@ngrx/store';
// MODELS
import { Payment } from '../../../models/payment.model';
// LIST INDEX
import * as indexActions from './list_actions.actions';

// ACTIONS ADD
export class AddPayment implements Action {
  readonly type = indexActions.ADD_PAYMENT;
}

export class AddPaymentFail implements Action {
  readonly type = indexActions.ADD_PAYMENT_FAIL;
  constructor(public payload: any) {}
}

export class AddPaymentSuccess implements Action {
  readonly type = indexActions.ADD_PAYMENT_SUCCESS;
  constructor(public payload: Payment) {}
}

// ACTIONS GET ALL
export class GetAllPayments implements Action {
  readonly type = indexActions.GET_ALL_PAYMENTS;
}

export class GetAllPaymentsFail implements Action {
  readonly type = indexActions.GET_ALL_PAYMENTS_FAIL;
  constructor(public payload: any) {}
}

export class GetAllPaymentsSuccess implements Action {
  readonly type = indexActions.GET_ALL_PAYMENTS_SUCCESS;
  constructor(public payload: Payment[]) {}
}

export class UnsetPayments implements Action {
  readonly type = indexActions.UNSET_PAYMENTS;
}

export type paymentsActions =
  | AddPayment
  | AddPaymentFail
  | AddPaymentSuccess
  | GetAllPayments
  | GetAllPaymentsFail
  | GetAllPaymentsSuccess
  | UnsetPayments;
