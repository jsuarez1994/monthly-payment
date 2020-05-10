import { Component, OnInit } from '@angular/core';
// FORM
import { FormControl, FormGroup, Validators } from '@angular/forms';
// ROUTER
import { ActivatedRoute, Router } from '@angular/router';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// MODELS
import { User } from '../../../models/user.model';
// SERVICES
import { AuthGuardService } from '../../../services/auth-guard.service';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';
import { CategoryService } from '../../../services/category.service';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// SweetAlert
import { SweetAlertIcon } from 'sweetalert2';
import * as sweetAlert from '../../../shared/Utils/sweetalert';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [],
})
export class ResetPasswordComponent implements OnInit {
  // FORM
  form: FormGroup;
  // FLAG
  load: boolean;
  // LITERALS
  LiteralClass: literals.Literals;
  // USER IN SESSION
  user: User;
  // PARAMETER TO DO ACTION RESET
  oobCode: string;
  mode: string;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private authService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private categoryService: CategoryService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getParameters();
    // Init form
    this.initForm();
    this.getUserAuth();
  }

  getUserAuth() {
    this.authService.getUserAuth().subscribe((response) => {
      if (
        response.uid === undefined ||
        response.uid === '' ||
        response.uid === null
      ) {
        this.router.navigate([Constants.LOGIN_PATH]);
      } else {
        this.userService.setUserAlreadyLoged(response.uid).subscribe(() => {
          this.user = this.userService.getUser();
          this.form.controls['email'].setValue(this.user.email);
        });
      }
    });
  }

  /**
   * Get paramenters
   */
  getParameters() {
    this.oobCode = this.route.snapshot.queryParams.oobCode;
    this.mode = this.route.snapshot.queryParams.mode;

    if (
      (this.oobCode === undefined ||
        this.oobCode === '' ||
        this.oobCode === null) &&
      (this.mode === undefined || this.mode === '' || this.mode === null)
    ) {
      this.router.navigate([Constants.LOGIN_PATH]);
    }
  }

  /**
   * Init the form and validations of inputs
   */
  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      repeatNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.validPassword()) {
      this.user.password = this.form.value.newPassword;
      this.userService.updateUserPasswordService(this.user)
      .then(() => {
        this.authService.resetPasswordAction(this.oobCode, this.user)
        .then(() => {
          this.userService.logOutService();
          this.paymentService.cancelSubs();
          this.categoryService.cancelSubs();

          this.showMessage(['COMMONS.UPDATE', 'CONFIG-USER.UPDATE_PASSWORD_SUCCESS'], Constants.ICON_SUCCESS);

          this.router.navigate([Constants.LOGIN_PATH]);
        })
        .catch(error => {
          console.error(error);
          const toast = this.LiteralClass.getLiterals(['COMMONS.ERROR']).get('COMMONS.ERROR');
          sweetAlert.toastMessage(toast, Constants.ICON_ERROR);

          // Return old password
          this.user.password = this.form.value.oldPassword;
          this.userService.updateUserPasswordService(this.user);
        });
      })
      .catch(error => {
        console.error(error);
        const toast = this.LiteralClass.getLiterals(['COMMONS.ERROR']).get('COMMONS.ERROR');
        sweetAlert.toastMessage(toast, Constants.ICON_ERROR);
      });
    }
  }

  validPassword() {
    const oldPassword = this.form.controls['oldPassword'].value;
    const newPassword = this.form.controls['newPassword'].value;
    const repeatNewPassword = this.form.controls['repeatNewPassword'].value;

    let flag: boolean = true;

    if (newPassword === this.user.password) {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_1',
        ],
        Constants.ICON_ERROR
      );
      flag = false;
    } else if (oldPassword !== this.user.password) {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_2',
        ],
        Constants.ICON_ERROR
      );
      flag = false;
    } else if (repeatNewPassword !== newPassword) {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_3',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (newPassword !== '' && oldPassword === '') {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_4',
        ],
        Constants.ICON_ERROR
      );
      flag = false;
    }

    // NOT VALID, RESET VALUES
    if(!flag) {
      this.form.controls['oldPassword'].reset();
      this.form.controls['newPassword'].reset();
      this.form.controls['repeatNewPassword'].reset();
    }

    return flag;

  }

  /**
   * Show message by Messages
   * @param messages
   * @param icon
   */
  showMessage(messages: string[], icon: SweetAlertIcon) {
    const mapLiterals = this.LiteralClass.getLiterals(messages);
    sweetAlert.showMessage(
      mapLiterals.get(messages[0]),
      mapLiterals.get(messages[1]),
      icon
    );
  }
}
