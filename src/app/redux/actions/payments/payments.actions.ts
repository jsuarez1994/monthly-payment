// NGRX
import { Action } from '@ngrx/store';
// MODELS
import { Payment } from '../../../models/payment.model';
// LIST INDEX
import * as indexActions from './list_actions.actions';

// ############### ACTIONS ADD ###############
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

// ############### ACTIONS DELETE ###############
export class DeletePayment implements Action {
  readonly type = indexActions.DELETE_PAYMENT;
}

export class DeletePaymentFail implements Action {
  readonly type = indexActions.DELETE_PAYMENT_FAIL;
  constructor(public payload: any) {}
}

export class DeletePaymentSuccess implements Action {
  readonly type = indexActions.DELETE_PAYMENT_SUCCESS;
  constructor(public payload: Payment) {}
}

// ############### ACTIONS UPDATE ###############
export class UpdatePayment implements Action {
  readonly type = indexActions.UPDATE_PAYMENT;
}

export class UpdatePaymentFail implements Action {
  readonly type = indexActions.UPDATE_PAYMENT_FAIL;
  constructor(public payload: any) {}
}

export class UpdatePaymentSuccess implements Action {
  readonly type = indexActions.UPDATE_PAYMENT_SUCCESS;
  constructor(public payload: Payment, public payload2:string) {}
}

// ############### ACTIONS GET ALL ###############
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

// ############### UNSET ###############
export class UnsetPayments implements Action {
  readonly type = indexActions.UNSET_PAYMENTS;
}

export type paymentsActions =
  | AddPayment
  | AddPaymentFail
  | AddPaymentSuccess
  | DeletePayment
  | DeletePaymentFail
  | DeletePaymentSuccess
  | UpdatePayment
  | UpdatePaymentFail
  | UpdatePaymentSuccess
  | GetAllPayments
  | GetAllPaymentsFail
  | GetAllPaymentsSuccess
  | UnsetPayments;
