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
  | LogoutUser;