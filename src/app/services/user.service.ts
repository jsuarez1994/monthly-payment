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

        this.messagesLiterals([
          'REGISTER.ERROR_FIREBASE_AUTH_TITLE',
          'REGISTER.ERROR_FIREBASE_AUTH_MESSAGE',
        ], Constants.ICON_ERROR);

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
      .then(response => {
        console.log('### VAMOS LOGIN ###');

        this.messagesLiterals([
          'REGISTER.REGISTER_ACTION_COMPLETE_TITLE',
          'REGISTER.REGISTER_ACTION_COMPLETE_MESSAGE',
        ], Constants.ICON_SUCCESS);

        this.router.navigate([Constants.LOGIN_PATH]);

        this.storeRegisterSuccess(user);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals([
          'REGISTER.ERROR_PROCESS_TITLE',
          'REGISTER.ERROR_PROCESS_MESSAGE',
        ], Constants.ICON_ERROR);
        
        this.storeRegisterFail(error);
      });
  }

  /**
   * Login Service
   * @param user
   */
  loginService(user: User) {
    this.storeLogin();

    return this.firebaseAuthService.auth
      .signInWithEmailAndPassword(user.email, user.password);
  }

  updateUserService(user: User, oldPassword: string, obCode: string) {
    this.firebaseAuthService.auth.confirmPasswordReset(obCode, user.password)
    .then(() => {
      return this.updateUserAction(user, oldPassword);
    })
    .catch(error => {
      const literal = this.LiteralClass.getLiterals(['CONFIG-USER.ERROR_PROCESS_TITLE'])
                      .get('CONFIG-USER.ERROR_PROCESS_TITLE');
      sweetAlert.toastMessage(literal, Constants.ICON_ERROR);
    });
  }

  private updateUserAction(user, oldPassword) {

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
    this.firebaseService
        .doc(`${uid}/usuario`)
        .valueChanges()
        .pipe(
          map((item: User) => {
            this.user = {...item};
          })
        ).subscribe(() => {
          this.storeLoginSuccess(this.user);
        });
  }

  /**
   * Show message by literals
   * @param literals
   */
  private messagesLiterals(literals: string[], icon:SweetAlertIcon ) {
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
  private storeRegister(){
    this.store.dispatch(new userActions.RegisterUser());
  }

  /**
   * Call action when register is OK
   * @param param 
   */
  private storeRegisterSuccess(param: User){
    this.store.dispatch(new userActions.RegisterUserSuccess(param));
  }

  /**
   * Call action when register is KO
   * @param error 
   */
  private storeRegisterFail(error: any){
    this.store.dispatch(new userActions.RegisterUserFail(error));
  }

  /**
   * Call action when register init service
   */
  private storeLogin(){
    this.store.dispatch(new userActions.LoginUser());
  }

  /**
   * Call action when register is OK
   * @param param 
   */
  private storeLoginSuccess(param: User){
    this.store.dispatch(new userActions.LoginUserSuccess(param));
  }

  /**
   * Call action when register is KO
   * @param error 
   */
  private storeLoginFail(error: any){
    this.store.dispatch(new userActions.LoginUserFail(error));
  }

  /**
   * Call action when log out
   */
  private storeLogout(){
    this.store.dispatch(new userActions.LogoutUser());
  }
}
