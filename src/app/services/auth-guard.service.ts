import { Injectable } from '@angular/core';
// CORE
import { CanLoad, Router } from '@angular/router';
// RXJS
import { map, take } from 'rxjs/operators';
// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { Constants } from '../shared/Utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad{

  constructor(private router: Router, private firebaseAuthService: AngularFireAuth) { }

  canLoad() {
    return this.isAuth().pipe(take(1));
  }

  isAuth() {
    // Retorna true o false, pipe trata la salida y map cambia tipo
    console.log('### IS AUTH ###');
    return this.firebaseAuthService.authState.pipe(
      map( fbUser => {
        if ( fbUser === null ) {
          this.router.navigate([Constants.LOGIN_PATH]);
        }
        return fbUser != null;
      })
    );
  }
}
