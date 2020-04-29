import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// FORMS
import { FormGroup, Validators, FormControl } from '@angular/forms';
// DATA PICKER
import { IgxMonthPickerComponent } from 'igniteui-angular';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// UTILS
import * as utils from '../../../shared/Utils/utils';
// MODELS
import { Payment } from 'src/app/models/payment.model';
// SERVICES
import { PaymentService } from '../../../services/payment.service';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/redux/app.reducers';
// RXJS
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styles: [],
})
export class AddPaymentComponent implements OnInit, OnDestroy {
  // FORM
  form: FormGroup;
  // FLAG
  loaded: boolean;
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // TYPES
  types: string[];
  // NATURES
  natures: string[];
  // SUBSCRIBE
  subs: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private paymentService: PaymentService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllTypes();
    this.getAllNature();
    // Init form
    this.initForm();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  /**
   * Init form
   */
  initForm() {
    this.form = new FormGroup({
      nature: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl('', Validators.required),
    });

    this.subs = this.store.select('payments').subscribe( response => {
      this.loaded = response.loaded;
    });
  }

  /**
   * Get all types to combo
   */
  getAllTypes() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'ADD-PAYMENT.TYPE_PERSONAL',
      'ADD-PAYMENT.TYPE_PERMANENT',
    ]);
    this.types = [
      mapLiterals.get('ADD-PAYMENT.TYPE_PERSONAL'),
      mapLiterals.get('ADD-PAYMENT.TYPE_PERMANENT'),
    ];
  }

  /**
   * Get all Natures to combo
   */
  getAllNature() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'ADD-PAYMENT.NATURE_GAIN',
      'ADD-PAYMENT.NATURE_EXPENDITURE',
    ]);
    this.natures = [
      mapLiterals.get('ADD-PAYMENT.NATURE_GAIN'),
      mapLiterals.get('ADD-PAYMENT.NATURE_EXPENDITURE'),
    ];
  }

  /**
   * Submit form
   */
  onSubmit() {
    
    const payment: Payment = {
      ...this.form.value,
      period: utils.setPeriod(
        this.form.value.period.getMonth() + 1,
        this.form.value.period.getFullYear()
      ),
    };

    this.paymentService.addPayment(payment);
    this.form.reset();
  }
}
