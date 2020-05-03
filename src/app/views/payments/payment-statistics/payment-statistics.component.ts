import { Component, OnInit, OnDestroy } from '@angular/core';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// ROUTER
import { Router } from '@angular/router';
// MODELS
import { Payment } from 'src/app/models/payment.model';
import { ObjectiveTable } from 'src/app/models/objective-table.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// UTILS
import * as utils from '../../../shared/Utils/utils';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-statistics',
  templateUrl: './payment-statistics.component.html',
  styles: [],
})
export class PaymentStatisticsComponent implements OnInit, OnDestroy {
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // PAYMENTS
  payments: Payment[] = [];
  // YEARS HAS PAYMENT
  years: string[] = [];
  yearSelected: string;
  // SUBS
  subsPayments: Subscription = new Subscription();
  // HEADERS OBJECTIVE
  headersObjective: any[] = [];
  // VALUES TABLE OBJECTIVE
  objectiveValues: ObjectiveTable;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllPayments();
  }

  ngOnDestroy() {
    this.subsPayments.unsubscribe();
  }

  /**
   * Get all payments
   */
  getAllPayments() {
    this.subsPayments = this.store.select('payments').subscribe((items) => {
      this.payments = items.payments;
      this.getYears();
      this.infTableObjective();
    });
  }

  /**
   * Get disctinct years hace payments
   */
  getYears() {
    this.years = utils.periodToYears([
      ...new Set(this.payments.map((item) => item.period)),
    ]);
    // Year select now    
    this.yearSelected = String(new Date().getFullYear());
  }

  /**
   * INFORMATION TABLE OBJECTIVE
   */
  infTableObjective() {
    this.getHeadersObjective();
    this.getValuesObjective();
  }

  /**
   * HEADERS OBJECTIVE
   */
  getHeadersObjective() {
    const headersValue = this.LiteralClass.getLiterals([
      'STATISTICS-PAYMENT.AVERAGE_ENTRY',
      'STATISTICS-PAYMENT.SAVING',
      'STATISTICS-PAYMENT.SAVING_IN_YEAR',
      'STATISTICS-PAYMENT.PERSONAL_EXPENSIVE',
      'STATISTICS-PAYMENT.PERMANENT_EXPENSIVE',
    ]);

    // FUTURE VARIABLE
    let savingHeader = headersValue.get('STATISTICS-PAYMENT.SAVING').replace('<SAVING_PORCERT>', '20%');
    let perExpensiveHeader = headersValue.get('STATISTICS-PAYMENT.PERSONAL_EXPENSIVE').replace('<PERS_EXPENSIVE_PORCERT>', '30%');
    let permExpensivegHeader = headersValue.get('STATISTICS-PAYMENT.PERMANENT_EXPENSIVE').replace('<PERM_EXPENSIVE_PORCERT>', '50%');

    this.headersObjective = [
      {
        key: 'averageEntry',
        value: headersValue.get('STATISTICS-PAYMENT.AVERAGE_ENTRY'),
      },
      { key: 'saving', value: savingHeader },
      {
        key: 'savingInYear',
        value: headersValue.get('STATISTICS-PAYMENT.SAVING_IN_YEAR'),
      },
      {
        key: 'personalExpensive',
        value: perExpensiveHeader,
      },
      {
        key: 'permanentExpensive',
        value: permExpensivegHeader,
      },
    ];
  }

  /**
   * Values table objective
   */
  getValuesObjective() {
    // VALUE GAIN
    let natureGain = this.LiteralClass.getLiterals(['ADD-CATEGORY.NATURE_GAIN']).get('ADD-CATEGORY.NATURE_GAIN');
    // EMPTY MODEL
    this.objectiveValues = new ObjectiveTable();
    // PAYMENTS OF YEAR SELECT
    let paymentsByFilter = this.payments.filter(payment => utils.getYearByPeriod(payment.period) === this.yearSelected && payment.nature === natureGain);

    if(paymentsByFilter.length > 0){
      let averageEntry = paymentsByFilter.reduce((sum, item) => sum + item.quantity,0) / paymentsByFilter.length;
      this.objectiveValues = new ObjectiveTable(averageEntry);
    }
  }

}
