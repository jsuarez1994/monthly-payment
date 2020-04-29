import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// NGRX
import { AppState } from 'src/app/redux/app.reducers';
import { Store } from '@ngrx/store';
// MODELS
import { Payment } from 'src/app/models/payment.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// UTILS
import * as utils from '../../../shared/Utils/utils';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: [],
})
export class PaymentComponent implements OnInit {
  // PAYMENTS
  payments: Payment[];
  sumQuantity: number;
  // HEADERS
  headers: any[];
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // NATURES
  natures: string[];
  @ViewChild('naturePayment') naturePayment: ElementRef;
  natureSelect: string;
  // DATES
  periodSelect: string

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }
  
  ngOnInit(): void {
    this.getAllNatures();
    this.defaultFilters();
    this.getAllPayments();
    this.getHeaders();
  }

  /**
   * Get all types to combo
   */
  getAllNatures() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'PAYMENT.NATURE_GAIN',
      'PAYMENT.NATURE_EXPENDITURE',
    ]);
    this.natures = [
      mapLiterals.get('PAYMENT.NATURE_GAIN'),
      mapLiterals.get('PAYMENT.NATURE_EXPENDITURE'),
    ];
  }

  /**
   * Give values to filter by default
   */
  defaultFilters() {
    // Value nature
    this.natureSelect = this.natures[0];
    // Value period
    this.periodSelect = utils.currentDate();
  }

  getAllPayments() {
    this.store.select('payments').subscribe((items) => {
      // GET PAYMENTS GAINS
      this.payments = items.payments.filter(
        (payments) => payments.nature === this.natureSelect && payments.period === this.periodSelect
      );
      // GET SUM ALL QUANTITIES
      this.sumQuantity = this.payments.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    });
  }

  getHeaders() {
    const headersValue = this.LiteralClass.getLiterals([
      'PAYMENT.HEADER_NATURE',
      'PAYMENT.HEADER_DESCRIPTION',
      'PAYMENT.HEADER_QUATITY',
      'PAYMENT.HEADER_TYPE',
    ]);
    this.headers = [
      { key: 'nature', value: headersValue.get('PAYMENT.HEADER_NATURE') },
      { key: 'type', value: headersValue.get('PAYMENT.HEADER_TYPE') },
      {
        key: 'description',
        value: headersValue.get('PAYMENT.HEADER_DESCRIPTION'),
      },
      { key: 'quantity', value: headersValue.get('PAYMENT.HEADER_QUATITY') },
    ];
  }

  /**
   * Get new period select in input datapicker
   * @param period 
   */
  changePeriod(period: string){
    this.periodSelect = period;
    this.findByFilter();
  }

  /**
   * Find in payments by new filters
   */
  findByFilter() {
    this.natureSelect = this.naturePayment.nativeElement.value;
    // CALL GET ALL PAYMENTS
    this.getAllPayments();
  }
}
