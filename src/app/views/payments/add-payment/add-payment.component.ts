import { Component, OnInit } from '@angular/core';
// FORMS
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styles: [
  ]
})
export class AddPaymentComponent implements OnInit {

  form: FormGroup;
  load: boolean;

  constructor() { }

  ngOnInit(): void {
    // Init form
    this.initForm();
  }

  initForm() {
    this.load = false;
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    console.log(this.form.value);
  }

}
