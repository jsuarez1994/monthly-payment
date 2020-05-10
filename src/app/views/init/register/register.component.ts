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
// UTILS
import * as validatePorcent from '../../../shared/Utils/validtePorcent';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  @ViewChild('repeatPassword') repeatPassword: ElementRef;

  load: boolean;

  LiteralClass: literals.Literals;

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
    // Init form
    this.initForm();
  }

  /**
   * Init the form and validations of inputs
   */
  initForm() {
    this.load = false;

    this.porcentPermanent = '50%';
    this.porcentPersonal = '30%';
    this.porcentSaving = '20%';

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      document: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.DOCUMENT_PATTERN),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      porcentPaymentPermanent: new FormControl(50, [Validators.required, Validators.max(50)]),
      porcentPaymentPersonal: new FormControl(30, [Validators.required, Validators.max(30)]),
      porcentSaving: new FormControl(20, [Validators.required, Validators.min(20)])
    });
  }

  /**
   * Submit of form of register
   */
  onSubmit() {
    this.load = true;
    if (this.validPocents()){
      if (this.form.value.password !== this.repeatPassword.nativeElement.value) {
        this.showMessage([
          'COMMONS.ERROR',
          'REGISTER.PASSWORD_NOT_EQUALS',
        ], Constants.ICON_ERROR);

      } else {
        // Call store to dispatch service user
        const user: User = { ...this.form.value };
        this.userService.registerService(user);
      }
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
   * Dispatch when change value porcent
   * @param $event
   */
  changeValuePorcent($event) {

    switch ($event.srcElement.id) {
      case 'porcentPermanent':
        this.porcentPermanent = String(this.form.value.porcentPaymentPermanent).concat(' %');
        break;

      case 'porcentPersonal':
        this.porcentPersonal = String(this.form.value.porcentPaymentPersonal).concat(' %');
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
  showMessage(messages: string [], icon: SweetAlertIcon) {
    const mapLiterals = this.LiteralClass.getLiterals(messages);
    sweetAlert.showMessage(
      mapLiterals.get(messages[0]),
      mapLiterals.get(messages[1]),
      icon
    );
  }
}
