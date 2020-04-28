import { Component, OnInit } from '@angular/core';
// NGRX
import { AppState } from 'src/app/redux/app.reducers';
import { Store } from '@ngrx/store';
// MODELS
import { Payment } from 'src/app/models/payment.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: [],
})
export class PaymentComponent implements OnInit {
  // PAYMENTS
  paymentsGain: Payment[];
  sumQuantityGain: number;
  paymentsExpenditure: Payment[];
  sumQuantityExpenditure: number;
  // HEADERS
  headers: any[];
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllPayments();
    this.getHeaders();
  }

  getAllPayments() {
    const mapGainExpenditure = this.LiteralClass.getLiterals([
      'PAYMENT.NATURE_GAIN',
      'PAYMENT.NATURE_EXPENDITURE',
    ]);

    this.store.select('payments').subscribe((items) => {
      // GET PAYMENTS GAINS
      this.paymentsGain = items.payments.filter(
        (payments) =>
          payments.nature === mapGainExpenditure.get('PAYMENT.NATURE_GAIN')
      );
      // GET SUM ALL QUANTITIES
      this.sumQuantityGain = this.paymentsGain.reduce((sum, item) => sum + item.quantity,0);

      // GET PAYMENTS EXPENDITURE
      this.paymentsExpenditure = items.payments.filter(
        (payments) =>
          payments.nature ===
          mapGainExpenditure.get('PAYMENT.NATURE_EXPENDITURE')
      );
      // GET SUM ALL QUANTITIES
      this.sumQuantityExpenditure = this.paymentsExpenditure.reduce((sum, item) => sum + item.quantity,0);
    });
  }

  getHeaders() {
    const headersValue = this.LiteralClass.getLiterals([
      'PAYMENT.HEADER_NATURE',
      'PAYMENT.HEADER_DESCRIPTION',
      'PAYMENT.HEADER_QUATITY',
      'PAYMENT.HEADER_TYPE'
    ]);
    this.headers = [
      { key: 'nature', value: headersValue.get('PAYMENT.HEADER_NATURE') },
      { key: 'type', value: headersValue.get('PAYMENT.HEADER_TYPE') },
      {
        key: 'description',
        value: headersValue.get('PAYMENT.HEADER_DESCRIPTION'),
      },
      { key: 'quantity', value: headersValue.get('PAYMENT.HEADER_QUATITY') }
    ];
  }
}
