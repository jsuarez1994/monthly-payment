// CORE
import { Injectable } from '@angular/core';
// NGRX EFFECTS
import { Actions, Effect, ofType } from '@ngrx/effects';
// LIST INDEX ACTION
import * as indexActions from '../actions/users/list_actions.actions';
// ACTION
import {
  LoginUser,
  LoginUserSuccess,
  LoginUserFail,
  RegisterUser,
  RegisterUserSuccess,
  RegisterUserFail
} from '../actions/users/users.actions';
// RXJS
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// SERVICES
import { UserService } from '../../services/user.service';
// MODELS
import { User } from '../../models/user.model';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userSerice: UserService) {}

  /**
   * Effect to Login
   */
  /*@Effect()
  loginUser$ = this.actions$.pipe(ofType(indexActions.LOGIN_USER)).pipe(
    switchMap((action: LoginUser) => {
      return this.userSerice.loginService(action.payload).pipe(
        map((user: User) => new LoginUserSuccess(user)),
        catchError((error) => of(new LoginUserFail(error)))
      );
    })
  );*/

  /**
   * Effect to Register
   */
  /*@Effect()
  registerUser$ = this.actions$.pipe(ofType(indexActions.REGISTER_USER)).pipe(
    switchMap((action: RegisterUser) => {
      return this.userSerice.registerService(action.payload).pipe(
        map((user: User) => new RegisterUserSuccess(user)),
        catchError((error) => of(new RegisterUserFail(error)))
      );
    })
  );*/
}
