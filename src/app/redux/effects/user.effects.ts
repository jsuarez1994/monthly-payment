// CORE
import { Injectable } from '@angular/core';
// NGRX EFFECTS
import { Actions, Effect, ofType } from '@ngrx/effects';
// LIST INDEX ACTION
import * as indexActions from '../actions/users/list_actions.actions'
// ACTION
import { userActions, LoginUser } from '../actions/users/users.actions';
// RXJS
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// SERVICES
import { UserService } from '../../services/user.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userSerice: UserService) {}

  /*@Effect()
  loginUser$ = this.actions$.pipe(ofType(indexActions.LOGIN_USER)).pipe(
    switchMap((action: userActions.LoginUser) => {
      return this.userSerice.loginService(action.id).pipe(
        map((user) => new userActions.CargarUsuarioSuccess(user)),
        catchError((error) => of(new userActions.CargarUsuarioFail(error)))
      );
    })
  );*/
}
