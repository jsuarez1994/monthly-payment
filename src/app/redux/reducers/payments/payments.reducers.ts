// MODEL
import { Payment } from '../../../models/payment.model';
// ACTIONS USER
import * as paymentAction from '../../actions';
// LIST ACTIONS
import * as listActions from '../../actions/payments/list_actions.actions';
// INTERFACE USER
import { PaymentState } from './payment.interface';

/**
 * Initialize state to manage
 */
const initState: PaymentState = initializeState();

export function paymentReducer(
  state = initState,
  action: paymentAction.paymentsActions
): PaymentState {
  switch (action.type) {
    case listActions.ADD_PAYMENT:
      return returnStateADD_PAYMENT(state);

    case listActions.ADD_PAYMENT_SUCCESS:
      return returnStateADD_PAYMENT_SUCCESS(state, action.payload);

    case listActions.ADD_PAYMENT_FAIL:
      return returnStateADD_PAYMENT_FAIL(state, action.payload);

    case listActions.DELETE_PAYMENT:
      return returnStateDELETE_PAYMENT(state);

    case listActions.DELETE_PAYMENT_SUCCESS:
      return returnStateDELETE_PAYMENT_SUCCESS(state, action.payload);

    case listActions.DELETE_PAYMENT_FAIL:
      return returnStateDELETE_PAYMENT_FAIL(state, action.payload);

    case listActions.UPDATE_PAYMENT:
      return returnStateUPDATE_PAYMENT(state);

    case listActions.UPDATE_PAYMENT_SUCCESS:
      return returnStateUPDATE_PAYMENT_SUCCESS(state, action.payload, action.payload2);

    case listActions.UPDATE_PAYMENT_FAIL:
      return returnStateUPDATE_PAYMENT_FAIL(state, action.payload);

    case listActions.GET_ALL_PAYMENTS:
      return returnStateGET_ALL_PAYMENTS(state);

    case listActions.GET_ALL_PAYMENTS_SUCCESS:
      return returnStateGET_ALL_PAYMENTS_SUCCESS(state, action.payload);

    case listActions.GET_ALL_PAYMENTS_FAIL:
      return returnStateGET_ALL_PAYMENTS_FAIL(state, action.payload);

    case listActions.UNSET_PAYMENTS:
      return returnStateUNSET_PAYMENTS(state);

    default:
      return state;
  }
}

/**
 * Initialize state to manage
 */
function initializeState(): PaymentState {
  return {
    payments: [],
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action ADD_PAYMENT
 * @param state
 */
function returnStateADD_PAYMENT(state: PaymentState): PaymentState {
  console.log('### ADD PAYMENT STATE ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action ADD_PAYMENT_SUCCESS
 * @param state
 * @param action
 */
function returnStateADD_PAYMENT_SUCCESS(
  state: PaymentState,
  params: Payment
): PaymentState {
  console.log('### ADD PAYMENT SUCCESS STATE ###');
  console.log(state);
  console.log('### ADD PAYMENT SUCCESS PARAMS ###');
  console.log(params);

  // Add new Payment
  let paymentsState: Payment[] = state.payments;
  paymentsState.push(params);

  return {
    ...state,
    payments: paymentsState,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action ADD_PAYMENT_FAIL
 * @param state
 * @param params
 */
function returnStateADD_PAYMENT_FAIL(
  state: PaymentState,
  params: any
): PaymentState {
  console.log('###  USER FAIL STATE ###');
  console.log(state);
  console.log('###  USER FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action DELETE_PAYMENT
 * @param state
 */
function returnStateDELETE_PAYMENT(state: PaymentState): PaymentState {
  console.log('### DELETE PAYMENT STATE ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action DELETE_PAYMENT_SUCCESS
 * @param state
 * @param action
 */
function returnStateDELETE_PAYMENT_SUCCESS(
  state: PaymentState,
  params: Payment
): PaymentState {
  console.log('### DELETE PAYMENT SUCCESS STATE ###');
  console.log(state);
  console.log('### DELETE PAYMENT SUCCESS PARAMS ###');
  console.log(params);

  // Delete new Payment
  let paymentsState: Payment[] = state.payments;
  paymentsState.splice(paymentsState.indexOf(params));

  return {
    ...state,
    payments: paymentsState,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action DELETE_PAYMENT_FAIL
 * @param state
 * @param params
 */
function returnStateDELETE_PAYMENT_FAIL(
  state: PaymentState,
  params: any
): PaymentState {
  console.log('###  DELETE PAYMENT FAIL STATE ###');
  console.log(state);
  console.log('###  DELETE PAYMENT FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action UPDATE_PAYMENT
 * @param state
 */
function returnStateUPDATE_PAYMENT(state: PaymentState): PaymentState {
  console.log('### UPDATE PAYMENT STATE ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action UPDATE_PAYMENT_SUCCESS
 * @param state
 * @param action
 */
function returnStateUPDATE_PAYMENT_SUCCESS(
  state: PaymentState,
  payment: Payment,
  oldPeriod: string
): PaymentState {
  console.log('### UPDATE PAYMENT SUCCESS STATE ###');
  console.log(state);
  console.log('### UPDATE PAYMENT SUCCESS PARAMS ###');
  console.log(payment);
  console.log(oldPeriod);

  // Update Payment
  let payments: Payment[] = state.payments; // Copy list
  let paymentUpdate: Payment = payments.filter(
    (payment) => payment.description === payment.description && payment.period === oldPeriod
  )[0]; // find item to update
  let indexUpdate: number = payments.indexOf(paymentUpdate); // find index item update

  // UPDATE VALUES CAN MODIFY
  paymentUpdate.quantity = payment.quantity;
  paymentUpdate.period = payment.period;

  payments[indexUpdate] = paymentUpdate; // SAVE IN INDEX

  return {
    ...state,
    payments: payments,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action UPDATE_PAYMENT_FAIL
 * @param state
 * @param params
 */
function returnStateUPDATE_PAYMENT_FAIL(
  state: PaymentState,
  params: any
): PaymentState {
  console.log('###  DELETE PAYMENT FAIL STATE ###');
  console.log(state);
  console.log('###  DELETE PAYMENT FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action GET_ALL_PAYMENTS
 * @param state
 * @param params
 */
function returnStateGET_ALL_PAYMENTS(state: PaymentState): PaymentState {
  console.log('### GET ALL PAYMENTS ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action GET_ALL_PAYMENTS_SUCCESS
 * @param state
 * @param params
 */
function returnStateGET_ALL_PAYMENTS_SUCCESS(
  state: PaymentState,
  params: Payment[]
): PaymentState {
  console.log('### GET ALL PAYMENTS SUCCESS STATE ###');
  console.log(state);
  console.log('### GET ALL PAYMENTS SUCCESS PARAMS ###');
  console.log(params);
  return {
    ...state,
    payments: params,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action GET_ALL_PAYMENTS_FAIL
 * @param state
 * @param params
 */
function returnStateGET_ALL_PAYMENTS_FAIL(
  state: PaymentState,
  params: any
): PaymentState {
  console.log('### GET ALL PAYMENTS FAIL STATE ###');
  console.log(state);
  console.log('### GET ALL PAYMENTS FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action GET_ALL_PAYMENTS_FAIL
 * @param state
 * @param params
 */
function returnStateUNSET_PAYMENTS(state: PaymentState): PaymentState {
  console.log('### GET ALL PAYMENTS FAIL STATE ###');
  console.log(state);
  return {
    ...state,
    payments: [],
    loaded: true,
    error: null,
  };
}
