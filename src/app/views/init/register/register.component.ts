import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// FORMS
import { FormGroup, FormControl, Validators } from '@angular/forms';
// SWEET ALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
// MODELS
import { User } from '../../../models/user.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// SERVICES
import { UserService } from '../../../services/user.service';

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
    });
  }

  /**
   * Submit of form of register
   */
  onSubmit() {
    this.load = true;

    if (this.form.value.password !== this.repeatPassword.nativeElement.value) {
      this.showMessageErrorPassword();
    } else {
      // Call store to dispatch service user
      const user: User = { ...this.form.value };
      this.userService.registerService(user);
    }
    this.load = false;
  }

  /**
   * Show message when password not equals
   */
  showMessageErrorPassword() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'COMMONS.ERROR',
      'REGISTER.PASSWORD_NOT_EQUALS'
    ]);
    sweetAlert.showMessage(
      mapLiterals.get('COMMONS.ERROR'),
      mapLiterals.get('REGISTER.PASSWORD_NOT_EQUALS'),
      Constants.ICON_ERROR
    );
  }
}
