// NGRX
import { Action } from '@ngrx/store';
// MODELS
import { User } from '../../../models/user.model';
// LIST INDEX
import * as indexActions from './list_actions.actions';

// ACTIONS LOGIN
export class LoginUser implements Action {
  readonly type = indexActions.LOGIN_USER;
}

export class LoginUserFail implements Action {
  readonly type = indexActions.LOGIN_USER_FAIL;
  constructor(public payload: any) {}
}

export class LoginUserSuccess implements Action {
  readonly type = indexActions.LOGIN_USER_SUCCESS;
  constructor(public payload: User) {}
}

// ACTIONS REGISTER
export class RegisterUser implements Action {
  readonly type = indexActions.REGISTER_USER;
}

export class RegisterUserFail implements Action {
  readonly type = indexActions.REGISTER_USER_FAIL;
  constructor(public payload: any) {}
}

export class RegisterUserSuccess implements Action {
  readonly type = indexActions.REGISTER_USER_SUCCESS;
  constructor(public payload: User) {}
}

// ACTIONS UPDATE
export class UpdateUser implements Action {
  readonly type = indexActions.UPDATE_USER;
}

export class UpdateUserFail implements Action {
  readonly type = indexActions.UPDATE_USER_FAIL;
  constructor(public payload: any) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = indexActions.UPDATE_USER_SUCCESS;
  constructor(public payload: User) {}
}

// ACTIONS UPDATE
export class UpdateUserPassword implements Action {
  readonly type = indexActions.UPDATE_USER_PASSWORD;
}

export class UpdateUserPasswordFail implements Action {
  readonly type = indexActions.UPDATE_USER_PASSWORD_FAIL;
  constructor(public payload: any) {}
}

export class UpdateUserPasswordSuccess implements Action {
  readonly type = indexActions.UPDATE_USER_PASSWORD_SUCCESS;
  constructor(public payload: User) {}
}

// ACTION LOGOUT
export class LogoutUser implements Action {
  readonly type = indexActions.LOGOUT_USER;
}

export type userActions =
  | LoginUser
  | LoginUserFail
  | LoginUserSuccess
  | RegisterUser
  | RegisterUserFail
  | RegisterUserSuccess
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFail
  | UpdateUserPassword
  | UpdateUserPasswordSuccess
  | UpdateUserPasswordFail
  | LogoutUser;
