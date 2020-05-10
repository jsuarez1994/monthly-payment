import { Injectable } from '@angular/core';
// ROUTER
import { Router } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../shared/Utils/literals';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
// MODELS
import { User } from '../models/user.model';
// ACTIONS
import * as userActions from '../redux/actions';
import { AppState } from '../redux/app.reducers';
// CONSTANTS
import { Constants } from '../shared/Utils/constants';
// SWEETALERT
import { SweetAlertIcon } from 'sweetalert2';
import * as sweetAlert from '../shared/Utils/sweetalert';
// RXJS
import { map } from 'rxjs/internal/operators/map';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  LiteralClass: literals.Literals;
  user: User;

  constructor(
    private firebaseAuthService: AngularFireAuth,
    private router: Router,
    private firebaseService: AngularFirestore,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  /**
   * Register Service
   * @param user
   */
  registerService(user: User) {
    this.storeRegister();

    // Register to authentication
    this.firebaseAuthService.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        user.uid = response.user.uid;
        // Register Database
        this.registerAction(user);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals(
          [
            'REGISTER.ERROR_FIREBASE_AUTH_TITLE',
            'REGISTER.ERROR_FIREBASE_AUTH_MESSAGE',
          ],
          Constants.ICON_ERROR
        );

        this.storeRegisterFail(error);
      });
  }

  /**
   * Register Action
   * @param user
   */
  private registerAction(user: User) {
    // Register Database
    this.firebaseService
      .doc(`${user.uid}/usuario`)
      .set(user)
      .then((response) => {
        console.log('### VAMOS LOGIN ###');

        this.messagesLiterals(
          [
            'REGISTER.REGISTER_ACTION_COMPLETE_TITLE',
            'REGISTER.REGISTER_ACTION_COMPLETE_MESSAGE',
          ],
          Constants.ICON_SUCCESS
        );

        this.router.navigate([Constants.LOGIN_PATH]);

        this.storeRegisterSuccess(user);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals(
          ['REGISTER.ERROR_PROCESS_TITLE', 'REGISTER.ERROR_PROCESS_MESSAGE'],
          Constants.ICON_ERROR
        );

        this.storeRegisterFail(error);
      });
  }

  /**
   * Login Service
   * @param user
   */
  loginService(user: User) {
    this.storeLogin();

    return this.firebaseAuthService.auth.signInWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  /**
   * Update data user
   * @param user
   */
  updateUserService(user: User) {
    this.storeUpdateUser();
    return this.firebaseService
      .doc(`${user.uid}/usuario`)
      .update({
        name: user.name,
        surname: user.surname,
        document: user.document,
        porcentPaymentPermanent: user.porcentPaymentPermanent,
        porcentPaymentPersonal: user.porcentPaymentPersonal,
        porcentSaving: user.porcentSaving,
      })
      .then(() => {
        this.storeUpdateUserSuccess(user);
      })
      .catch(error => {
        this.storeUpdateUserFail(error);
      });
  }

  /**
   * Update password user
   * @param user
   */
  updateUserPasswordService(user: User) {
    this.storeUpdateUserPassword();
    return this.firebaseService
      .doc(`${user.uid}/usuario`)
      .update({
        password: user.password,
      })
      .then(() => {
        this.storeUpdateUserPasswordSuccess(user);
      })
      .catch(error => {
        this.storeUpdateUserPasswordFail(error);
      });
  }

  /**
   * Log out user
   */
  logOutService() {
    this.router.navigate([Constants.LOGIN_PATH]);
    this.storeLogout();
    this.firebaseAuthService.auth.signOut();
  }

  /**
   * Return user loged
   */
  getUser(): User {
    return this.user;
  }

  /**
   * Return user loged
   */
  setUser(uid: string) {
    return this.firebaseService
      .doc(`${uid}/usuario`)
      .valueChanges()
      .pipe(
        map((item: User) => {
          this.user = { ...item };
        })
      )
      .subscribe(() => {
        this.storeLoginSuccess(this.user);
      });
  }

  /**
   * Return user loged when reset password
   */
  setUserAlreadyLoged(uid: string) {
    return this.firebaseService
      .doc(`${uid}/usuario`)
      .valueChanges()
      .pipe(
        map((item: User) => {
          this.user = { ...item };
        })
      );
  }

  /**
   * Show message by literals
   * @param literals
   */
  private messagesLiterals(literals: string[], icon: SweetAlertIcon) {
    const mapLiterals = this.LiteralClass.getLiterals(literals);

    sweetAlert.showMessage(
      mapLiterals.get(literals[0]),
      mapLiterals.get(literals[1]),
      icon
    );
  }

  /**
   * Call action when register init service
   */
  private storeRegister() {
    this.store.dispatch(new userActions.RegisterUser());
  }

  /**
   * Call action when register is OK
   * @param param
   */
  private storeRegisterSuccess(param: User) {
    this.store.dispatch(new userActions.RegisterUserSuccess(param));
  }

  /**
   * Call action when register is KO
   * @param error
   */
  private storeRegisterFail(error: any) {
    this.store.dispatch(new userActions.RegisterUserFail(error));
  }

  /**
   * Call action when update init service
   */
  private storeUpdateUser() {
    this.store.dispatch(new userActions.UpdateUser());
  }

  /**
   * Call action when update is OK
   * @param param
   */
  private storeUpdateUserSuccess(param: User) {
    this.store.dispatch(new userActions.UpdateUserSuccess(param));
  }

  /**
   * Call action when update is KO
   * @param error
   */
  private storeUpdateUserFail(error: any) {
    this.store.dispatch(new userActions.UpdateUserFail(error));
  }

  /**
   * Call action when update init service
   */
  private storeUpdateUserPassword() {
    this.store.dispatch(new userActions.UpdateUserPassword());
  }

  /**
   * Call action when update is OK
   * @param param
   */
  private storeUpdateUserPasswordSuccess(param: User) {
    this.store.dispatch(new userActions.UpdateUserPasswordSuccess(param));
  }

  /**
   * Call action when update is KO
   * @param error
   */
  private storeUpdateUserPasswordFail(error: any) {
    this.store.dispatch(new userActions.UpdateUserPasswordFail(error));
  }

  /**
   * Call action when register init service
   */
  private storeLogin() {
    this.store.dispatch(new userActions.LoginUser());
  }

  /**
   * Call action when register is OK
   * @param param
   */
  private storeLoginSuccess(param: User) {
    this.store.dispatch(new userActions.LoginUserSuccess(param));
  }

  /**
   * Call action when register is KO
   * @param error
   */
  private storeLoginFail(error: any) {
    this.store.dispatch(new userActions.LoginUserFail(error));
  }

  /**
   * Call action when log out
   */
  private storeLogout() {
    this.store.dispatch(new userActions.LogoutUser());
  }
}
