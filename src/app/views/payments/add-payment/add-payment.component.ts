import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
import { Category } from '../../../models/category.model';
// SWEETALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';

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
  // CATEGORIES
  categories: Category[];
  categorySelect: Category;
  // SUBSCRIBE
  subLoaded: Subscription = new Subscription();
  subCategories: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private paymentService: PaymentService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllCategories();
    // Init form
    this.initForm();
  }

  ngOnDestroy() {
    this.subLoaded.unsubscribe();
    this.subCategories.unsubscribe();
  }

  /**
   * Init form
   */
  initForm() {
    this.form = new FormGroup({
      category: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl('', Validators.required),
    });

    this.subLoaded = this.store.select('payments').subscribe((response) => {
      this.loaded = response.loaded;
    });
  }

  /**
   * Get all types to combo
   */
  getAllCategories() {
    this.subCategories = this.store.select('categories').subscribe((items) => {
      this.categories = items.categories;
    });
  }

  changeCategory() {
    this.categorySelect = this.categories.filter(
      (category) => category.description === this.form.value.category
    )[0];
  }

  /**
   * Submit form
   */
  onSubmit() {
    const payment: Payment = {
      ...this.categorySelect,
      quantity: this.form.value.quantity,
      period: utils.setPeriod(
        this.form.value.period.getMonth() + 1,
        this.form.value.period.getFullYear()
      ),
    };

    // VALIDATE ELEMENT NOT REPEAT
    if (this.paymentService.elementNotRepeat(this.paymentService.getPayments(), payment)) {
      this.paymentService.addPayment(payment);
      this.form.reset();
    } else {
      const map = this.LiteralClass.getLiterals(['ADD-PAYMENT.TOAST_TITLE_REPEAT']);
      let toast = map.get('ADD-PAYMENT.TOAST_TITLE_REPEAT');
      toast = toast.replace('<PERIOD>', utils.periodToDate([payment.period])[0]).replace('<CATEGORY>', payment.description);
      sweetAlert.toastMessage(toast, Constants.ICON_ERROR);
    }

  }
}
