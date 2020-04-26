import { Injectable } from '@angular/core';
// ROUTER
import { Router } from '@angular/router';
// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
// MODELS
import { User } from '../models/user.model';
// SWEETALERT
import * as sweetAlert from '../shared/Utils/sweetalert';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../shared/Utils/literals';

// CONSTANTS
import { Constants } from '../shared/Utils/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  LiteralClass: literals.Literals;

  constructor(
    private firebaseAuthService: AngularFireAuth,
    private router: Router,
    private firebaseService: AngularFirestore,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  /**
   * Register Service
   * @param user
   */
  registerService(user: User) {
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
        ]);
        
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
        ]);

        this.router.navigate([Constants.LOGIN_PATH]);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals([
          'REGISTER.ERROR_PROCESS_TITLE',
          'REGISTER.ERROR_PROCESS_MESSAGE',
        ]);
      });
  }

  /**
   * Login Service
   * @param user
   */
  loginService(user: User) {
    this.firebaseAuthService.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(() => {
        console.log('### VAMOS DASHBOARD ###');
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals([
          'LOGIN.ERROR_CREDENTIALS_TITLE',
          'LOGIN.ERROR_CREDENTIALS_MESSAGE',
        ]);
      });
  }

  /**
   * Show message by literals
   * @param literals
   */
  private messagesLiterals(literals: string[]) {
    const mapLiterals = this.LiteralClass.getLiterals(literals);

    sweetAlert.showMessage(
      mapLiterals.get(literals[0]),
      mapLiterals.get(literals[1]),
      Constants.ICON_ERROR
    );
  }
}
