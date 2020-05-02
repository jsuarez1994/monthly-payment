import { Component, OnInit, OnDestroy } from '@angular/core';
// ROUTE
import { ActivatedRoute, Router } from '@angular/router';
// MODELS
import { Payment } from 'src/app/models/payment.model';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// SERVICES
import { PaymentService } from '../../../services/payment.service';
// RXJS
import { Subscription } from 'rxjs';
// FORM
import { FormGroup, FormControl, Validators } from '@angular/forms';
// DATA PICKER
import { IgxMonthPickerComponent } from 'igniteui-angular';
// UTILS
import * as utils from '../../../shared/Utils/utils';
import { Constants } from '../../../shared/Utils/constants';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styles: [],
})
export class UpdatePaymentComponent implements OnInit, OnDestroy {
  // FORM
  form: FormGroup;
  loaded: boolean;
  // MODEL
  payment: Payment;
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  subsPayment: Subscription = new Subscription();
  subsLoaded: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getPaymentByParams(this.route.snapshot.paramMap.get('uid'));
    this.initForm();
  }

  ngOnDestroy() {
    this.subsPayment.unsubscribe();
  }

  getPaymentByParams(uid: string) {
    this.subsPayment = this.store.select('payments').subscribe((items) => {
      this.payment = items.payments.filter(
        (payment) => payment.uid === uid
      )[0];
    });
  }

  /**
   * Init form
   */
  initForm() {
    this.form = new FormGroup({
      category: new FormControl(this.payment.description, Validators.required),
      quantity: new FormControl(this.payment.quantity, [
        Validators.required,
        Validators.min(1),
      ]),
      period: new FormControl('', Validators.required),
    });

    this.subsLoaded = this.store.select('payments').subscribe((response) => {
      this.loaded = response.loaded;
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    console.log('### SUBMIT ###');

    let payment: Payment = new Payment();

    // SET ONLY TWO PROPERTIES THAT CAN MODIFY
    payment.quantity = this.form.value.quantity;
    payment.period = utils.setPeriod(
      this.form.value.period.getMonth() + 1,
      this.form.value.period.getFullYear()
    );
    payment.uid = this.payment.uid;

    this.paymentService.updatePayment(payment, this.payment.period);
    this.form.reset();
    // NAVIGATO TO PAYMENTS
    this.router.navigate(['/'.concat(Constants.DASHBOARD_PATH)]);
  }
}
