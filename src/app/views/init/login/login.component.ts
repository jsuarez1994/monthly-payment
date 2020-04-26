import { Component, OnInit } from '@angular/core';
// FORMS
import { FormGroup, FormControl, Validators } from '@angular/forms';
// SERVICES
import { UserService } from '../../../services/user.service';
// MODELS
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  load: boolean;

  constructor(private userService: UserService) {}

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
        Validators.minLength(6)
      ]),
    });
  }

  onSubmit() {
    this.load = true;
    const user: User = {...this.form.value};
    this.userService.loginService(user);
    this.load = false;
  }
}
