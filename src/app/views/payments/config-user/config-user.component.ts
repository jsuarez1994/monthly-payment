import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// FORMS
import { FormControl, FormGroup, Validators } from '@angular/forms';
// NGRX
import { Store } from '@ngrx/store';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// MODELS
import { User } from '../../../models/user.model';
// SERVICES
import { UserService } from '../../../services/user.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// SWEET ALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
import { SweetAlertIcon } from 'sweetalert2';
// UTILS
import * as validatePorcent from '../../../shared/Utils/validtePorcent';

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.component.html',
  styles: [],
})
export class ConfigUserComponent implements OnInit {
  form: FormGroup;

  @ViewChild('newPassword') newPassword: ElementRef;

  @ViewChild('repeatPassword') repeatPassword: ElementRef;

  @ViewChild('oldPassword') oldPassword: ElementRef;

  load: boolean;

  LiteralClass: literals.Literals;

  user: User;

  // VALUES PORCENT
  porcentPermanent: string;
  porcentPersonal: string;
  porcentSaving: string;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private authService: AuthGuardService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    // Init form
    this.initForm();
  }

  /**
   * Init the form and validations of inputs
   */
  initForm() {
    this.load = false;

    this.porcentPermanent = String(this.user.porcentPaymentPermanent).concat(
      ' %'
    );
    this.porcentPersonal = String(this.user.porcentPaymentPersonal).concat(
      ' %'
    );
    this.porcentSaving = String(this.user.porcentSaving).concat(' %');

    this.form = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      surname: new FormControl(this.user.surname, Validators.required),
      document: new FormControl(this.user.document, [
        Validators.required,
        Validators.pattern(Constants.DOCUMENT_PATTERN),
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', Validators.minLength(6)),
      porcentPaymentPermanent: new FormControl(
        this.user.porcentPaymentPermanent,
        [Validators.required, Validators.max(50)]
      ),
      porcentPaymentPersonal: new FormControl(
        this.user.porcentPaymentPersonal,
        [Validators.required, Validators.max(30)]
      ),
      porcentSaving: new FormControl(this.user.porcentSaving, [
        Validators.required,
        Validators.min(20),
      ]),
    });
  }

  /**
   * Submit of form of register
   */
  onSubmit() {
    this.load = true;
    if (this.validPocents()) {
      // Call store to dispatch service user
      this.setValuesForm();
      this.userService.updateUserService(this.user)
        .then(() => {
          const message = this.LiteralClass.getLiterals(['CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_SUCCESS'])
          .get('CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_SUCCESS');
          sweetAlert.toastMessage(message, Constants.ICON_SUCCESS);
        })
        .catch(error => {
          const message = this.LiteralClass.getLiterals(['CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_ERROR'])
          .get('CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_ERROR');
          sweetAlert.toastMessage(message, Constants.ICON_ERROR);
        });
    }
    this.load = false;
  }

  /**
   * Valid value of porcents
   */
  validPocents(): boolean {

      const mapPorcent: Map<string, number> = new Map<string, number>();
      mapPorcent.set('porcentPaymentPermanent', this.form.value.porcentPaymentPermanent);
      mapPorcent.set('porcentPaymentPersonal', this.form.value.porcentPaymentPersonal);
      mapPorcent.set('porcentSaving', this.form.value.porcentSaving);

      const message = validatePorcent.validatePorcent(mapPorcent);

      if (message.length === 0) {
        return true;
      } else {
        this.showMessage(message, Constants.ICON_ERROR);
        return false;
      }

  }

  /**
   * Prepare user model to update
   */
  setValuesForm() {
    this.user.name = this.form.value.name;
    this.user.surname = this.form.value.surname;
    this.user.document = this.form.value.document;
    this.user.porcentPaymentPermanent = this.form.value.porcentPaymentPermanent;
    this.user.porcentPaymentPersonal = this.form.value.porcentPaymentPersonal;
    this.user.porcentSaving = this.form.value.porcentSaving;
  }

  /**
   * Dispatch when change value porcent
   * @param $event
   */
  changeValuePorcent($event) {
    switch ($event.srcElement.id) {
      case 'porcentPermanent':
        this.porcentPermanent = String(
          this.form.value.porcentPaymentPermanent
        ).concat(' %');
        break;

      case 'porcentPersonal':
        this.porcentPersonal = String(
          this.form.value.porcentPaymentPersonal
        ).concat(' %');
        break;

      case 'porcentSaving':
        this.porcentSaving = String(this.form.value.porcentSaving).concat(' %');
        break;
    }
  }


  /**
   * Reset password step
   */
  resetPassword() {
    console.log(' ### RESET ### ');
    this.authService.resetPasswordInit(this.user.email)
    .then(() => {
      const message = this.LiteralClass.getLiterals(['CONFIG-USER.SEND_EMAIL_RESET_PASSWORD'])
                      .get('CONFIG-USER.SEND_EMAIL_RESET_PASSWORD')
                      .concat(this.user.email);
      sweetAlert.toastMessage(message, Constants.ICON_INFO);
    })
    .catch(error => {
      console.log(error);
      const message = this.LiteralClass.getLiterals(['CONFIG-USER.SEND_EMAIL_RESET_PASSWORD_ERROR'])
                      .get('CONFIG-USER.SEND_EMAIL_RESET_PASSWORD_ERROR');
      sweetAlert.toastMessage(message, Constants.ICON_ERROR);

    });
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
