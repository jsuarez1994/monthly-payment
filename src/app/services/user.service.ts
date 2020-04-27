import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// ROUTER
import { Router } from '@angular/router';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { SweetAlertIcon } from 'sweetalert2';
// MODELS
import { User } from '../models/user.model';
// CONSTANTS
import { Constants } from '../shared/Utils/constants';
import * as literals from '../shared/Utils/literals';
// SWEETALERT
import * as sweetAlert from '../shared/Utils/sweetalert';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../redux/app.reducers';
// ACTIONS
import * as userActions from '../redux/actions';
import { LoginUser } from '../redux/actions/users/users.actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  LiteralClass: literals.Literals;

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
      .then(() => {
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

    this.firebaseAuthService.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log('### VAMOS DASHBOARD ###');
        user.uid = response.user.uid;
        this.storeLoginSuccess(user);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals([
          'LOGIN.ERROR_CREDENTIALS_TITLE',
          'LOGIN.ERROR_CREDENTIALS_MESSAGE'
        ], Constants.ICON_ERROR);

        this.storeLoginFail(error);
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
}
