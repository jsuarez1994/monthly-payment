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
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';

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
    private router: Router
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getUserAuth();
  }

  getUserAuth() {
    this.authService.getUserAuth().subscribe(response => {
      this.userService.setUserAlreadyLoged(response.uid).subscribe(() => {
        this.getParameters();
        this.user = this.userService.getUser();
        // Init form
        this.initForm();
      });
    });
  }

  /**
   * Get paramenters
   */
  getParameters() {
    this.oobCode = this.route.snapshot.paramMap.get('oobCode');
    this.mode = this.route.snapshot.paramMap.get('mode');

    if ((this.oobCode === undefined || this.oobCode === '' /*|| this.oobCode === null*/) &&
        (this.mode === undefined || this.mode === ''/* || this.mode === null*/)) {
      this.router.navigate([Constants.DASHBOARD_PATH]);
    }
  }

  /**
   * Init the form and validations of inputs
   */
  initForm() {

    this.form = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
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
    console.log(' ### RESET ACTION ### ');
  }

}
