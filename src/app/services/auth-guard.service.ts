import { Injectable } from '@angular/core';
// CORE
import { CanLoad, Router } from '@angular/router';
// RXJS
import { map, take } from 'rxjs/operators';
// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
// CONSTANTS
import { Constants } from '../shared/Utils/constants';
// MODELS
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad {
  constructor(
    private router: Router,
    private firebaseAuthService: AngularFireAuth,
    private userService: UserService
  ) {}

  canLoad() {
    return this.isAuth().pipe(take(1));
  }

  isAuth() {
    // Retorna true o false, pipe trata la salida y map cambia tipo
    console.log('### IS AUTH ###');
    return this.firebaseAuthService.authState.pipe(
      map((fbUser) => {
        if (fbUser === null) {
          this.router.navigate([Constants.LOGIN_PATH]);
        }
        return fbUser != null;
      })
    );
  }

  /**
   * Return uid that user auth
   */
  getUserAuth() {
    return this.firebaseAuthService.user;
  }

  /**
   * Initiate the password reset process for this user
   * @param email email of the user
   */
  resetPasswordInit(email: string) {
    return this.firebaseAuthService.auth.sendPasswordResetEmail(email, {
      url: Constants.BASE_PATH,
    });
  }

  /**
   * Reset password Authentication and 
   * @param actionCode 
   * @param user 
   */
  resetPasswordAction(actionCode: string, user: User) {
    return this.firebaseAuthService.auth.confirmPasswordReset(actionCode, user.password);
  }

}
