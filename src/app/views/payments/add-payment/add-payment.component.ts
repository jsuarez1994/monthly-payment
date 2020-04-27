import { Component, OnInit, ViewChild } from '@angular/core';
// FORMS
import { FormGroup, Validators, FormControl } from '@angular/forms';
// DATA PICKER
import { IgxMonthPickerComponent } from "igniteui-angular";
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styles: [
  ]
})
export class AddPaymentComponent implements OnInit {

  // FORM
  form: FormGroup;
  // FLAG
  load: boolean;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  // TYPES
  types: string[];

  // NATURES
  natures: string[];

  constructor(private translate: TranslateService) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getTypes();
    this.getNature();
    // Init form
    this.initForm();
  }

  initForm() {
    this.load = false;
    this.form = new FormGroup({
      nature: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl('', Validators.required)
    });
  }

  getTypes() {
    const mapLiterals = this.LiteralClass.getLiterals(['ADD-PAYMENT.TYPE_PERSONAL', 'ADD-PAYMENT.TYPE_PERMANENT']);
    this.types = [
      mapLiterals.get('ADD-PAYMENT.TYPE_PERSONAL'),
      mapLiterals.get('ADD-PAYMENT.TYPE_PERMANENT')
    ]
  }

  getNature() {
    const mapLiterals = this.LiteralClass.getLiterals(['ADD-PAYMENT.NATURE_GAIN', 'ADD-PAYMENT.NATURE_EXPENDITURE']);
    this.natures = [
      mapLiterals.get('ADD-PAYMENT.NATURE_GAIN'),
      mapLiterals.get('ADD-PAYMENT.NATURE_EXPENDITURE')
    ]
  }

  changeType() {
    console.log(this.form.value);
  }

  onSubmit(){
    const period = this.form.value.period;

    // OBTENEMOS MES
    console.log(period.getMonth());
  }

}
