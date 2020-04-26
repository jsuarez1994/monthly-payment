// MODEL
import { User } from '../../../models/user.model';
// ACTIONS USER
import * as userAction from '../../actions';
// LIST ACTIONS
import * as listUserActions from '../../actions/users/list_actions.actions';
// INTERFACE USER
import { UserState } from './user.interface';

/**
 * Initialize state to manage
 */
const initState: UserState = initializeState();

export function userReducer(
  state = initState,
  action: userAction.userActions
): UserState {
  switch (action.type) {
    case listUserActions.LOGIN_USER:
      return returnStateLOGIN_USER(state);

    case listUserActions.LOGIN_USER_SUCCESS:
      return returnStateLOGIN_USER_SUCCESS(state, action.payload);

    case listUserActions.LOGIN_USER_FAIL:
      return returnStateLOGIN_USER_FAIL(state, action.payload);

    case listUserActions.REGISTER_USER:
      return returnStateREGISTER_USER(state);

    case listUserActions.REGISTER_USER_SUCCESS:
      return returnStateREGISTER_USER_SUCCESS(state, action.payload);

    case listUserActions.REGISTER_USER_FAIL:
      return returnStateREGISTER_USER_FAIL(state, action.payload);

    default:
      return state;
  }
}

/**
 * Initialize state to manage
 */
function initializeState(): UserState {
  return {
    user: null,
    authenticated: false,
    error: null,
  };
}

/**
 * Return state to action LOGIN_USER
 * @param state
 */
function returnStateLOGIN_USER(state: UserState): UserState {
  return {
    ...state,
    authenticated: false,
    error: null,
  };
}

/**
 * Return state to action LOGIN_USER_SUCCESS
 * @param state
 * @param action
 */
function returnStateLOGIN_USER_SUCCESS(
  state: UserState,
  params: any
): UserState {
  return {
    ...state,
    user: params,
    authenticated: true,
    error: null,
  };
}

/**
 * Return state to action LOGIN_USER_FAIL
 * @param state
 * @param params
 */
function returnStateLOGIN_USER_FAIL(state: UserState, params: any): UserState {
  return {
    ...state,
    user: null,
    authenticated: false,
    error: params,
  };
}

/**
 * Return state to action REGISTER_USER
 * @param state
 * @param params
 */
function returnStateREGISTER_USER(state: UserState): UserState {
  return {
    ...state,
    user: null,
    authenticated: false,
    error: null,
  };
}

/**
 * Return state to action REGISTER_USER_SUCCESS
 * @param state
 * @param params
 */
function returnStateREGISTER_USER_SUCCESS(
  state: UserState,
  params: any
): UserState {
  return {
    ...state,
    user: params,
    authenticated: false,
    error: null,
  };
}

/**
 * Return state to action REGISTER_USER_FAIL
 * @param state
 * @param params
 */
function returnStateREGISTER_USER_FAIL(
  state: UserState,
  params: any
): UserState {
  return {
    ...state,
    user: null,
    authenticated: false,
    error: params,
  };
}
