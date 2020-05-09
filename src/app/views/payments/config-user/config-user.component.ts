import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// FORMS
import { FormControl, FormGroup, Validators } from '@angular/forms';
// NGRX
import { Store } from '@ngrx/store';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
// MODELS
import { User } from '../../../models/user.model';
// SERVICES
import { UserService } from '../../../services/user.service';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
import * as literals from '../../../shared/Utils/literals';
// SWEET ALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
import { SweetAlertIcon } from 'sweetalert2';

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
    private userService: UserService
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
        [Validators.required, Validators.max(100)]
      ),
      porcentPaymentPersonal: new FormControl(
        this.user.porcentPaymentPersonal,
        [Validators.required, Validators.max(100)]
      ),
      porcentSaving: new FormControl(this.user.porcentSaving, [
        Validators.required,
        Validators.max(100),
      ]),
    });
  }

  /**
   * Submit of form of register
   */
  onSubmit() {
    this.load = true;
    if (this.validPocents()) {
      if (this.validPassword()) {
        // Call store to dispatch service user
        const user: User = { ...this.form.value };
        /*this.userService.updateUserService(user)
        .then(() => {
          const message = this.LiteralClass.getLiterals(['CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_SUCCESS'])
          .get('CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_SUCCESS');
          sweetAlert.toastMessage(message, Constants.ICON_SUCCESS);
          this.form.reset();
        })
        .catch(error => {
          const message = this.LiteralClass.getLiterals(['CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_ERROR'])
          .get('CONFIG-USER.CHANGE_PROPERTIES_ACTION_COMPLETE_ERROR');
          sweetAlert.toastMessage(message, Constants.ICON_ERROR);
        });*/
      } else {
        // EMPTY VALUES PASWORD
        this.form.value.password = '';
        this.newPassword.nativeElement.value = '';
        this.oldPassword.nativeElement.value = '';
        this.repeatPassword.nativeElement.value = '';
      }
    }
    this.load = false;
  }

  /**
   * Valid if want change password
   */
  validPassword() {
    if (this.form.value.password === '') {
      return true;
    } else if (this.form.value.password === this.user.password) {
      // MENSAJE NUEVA PASSWORD IGUAL ANTERIOR
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_1',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (this.oldPassword.nativeElement.value !== this.user.password) {
      // MENSAJE PASSWORD ANTERIOR NO ES IGUAL
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_2',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (
      this.repeatPassword.nativeElement.value !== this.form.value.password
    ) {
      // MENSAJE CONTRASEÑA REPETIDA NO COINCIDE
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_3',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (
      this.form.value.password !== '' &&
      this.oldPassword.nativeElement.value === ''
    ) {
      // MENSAJE PUESTA CONTRASEÑA NUEVA PERO NO ANTIGUA
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PASSWORD_TITLE',
          'CONFIG-USER.ERROR_PASSWORD_MESSAGE_4',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (
      this.oldPassword.nativeElement.value === this.user.password &&
      this.form.value.password === this.repeatPassword.nativeElement.value
    ) {
      return true;
    }
  }

  /**
   * Valid value of porcents
   */
  validPocents(): boolean {
    const sumPorcents =
      this.form.value.porcentPaymentPermanent +
      this.form.value.porcentPaymentPersonal +
      this.form.value.porcentSaving;

    if (sumPorcents > 100) {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PORCENT_TITLE',
          'CONFIG-USER.ERROR_PORCENT_MORE_THAN_ONE_HUNDRED',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else if (sumPorcents < 100) {
      this.showMessage(
        [
          'CONFIG-USER.ERROR_PORCENT_TITLE',
          'CONFIG-USER.ERROR_PORCENT_LESS_THAN_ONE_HUNDRED',
        ],
        Constants.ICON_ERROR
      );
      return false;
    } else {
      return true;
    }
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
