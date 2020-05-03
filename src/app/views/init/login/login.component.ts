import { Component, OnInit } from '@angular/core';
// FORMS
import { FormGroup, FormControl, Validators } from '@angular/forms';
// SERVICES
import { UserService } from '../../../services/user.service';
import { CategoryService } from '../../../services/category.service';
import { PaymentService } from '../../../services/payment.service';
// MODELS
import { User } from '../../../models/user.model';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
import * as userActions from '../../../redux/actions';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// ROUTER
import { Router } from '@angular/router';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// SWEETALERT
import { SweetAlertIcon } from 'sweetalert2';
import * as sweetAlert from '../../../shared/Utils/sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  load: boolean;
  LiteralClass: literals.Literals;

  constructor(
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router,
    private paymentService: PaymentService,
    private categoryService: CategoryService,
    private translate: TranslateService,
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    // Init form
    this.initForm();
  }

  initForm() {
    this.load = false;
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.load = true;
    const user: User = { ...this.form.value };
    this.userService
      .loginService(user)
      .then((response) => {
        user.uid = response.user.uid;
        this.userService.setUser(user);
        this.storeLoginSuccess(user);
        console.log('### VAMOS DASHBOARD ###');
        this.paymentService.getAllPayments();
        this.categoryService.getAllCategories();
        this.router.navigate([Constants.DASHBOARD_PATH]);
      })
      .catch((error) => {
        console.error('### ERROR: ' + error.message + ' ###');

        this.messagesLiterals(
          ['LOGIN.ERROR_CREDENTIALS_TITLE', 'LOGIN.ERROR_CREDENTIALS_MESSAGE'],
          Constants.ICON_ERROR
        );

        this.storeLoginFail(error);
      });
    this.load = false;
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
  private storeLoginFail(error: any){
    this.store.dispatch(new userActions.LoginUserFail(error));
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
}
