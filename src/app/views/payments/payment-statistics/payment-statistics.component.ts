import { Component, OnInit, OnDestroy } from '@angular/core';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// ROUTER
import { Router } from '@angular/router';
// MODELS
import { Payment } from 'src/app/models/payment.model';
import { ObjectiveTable } from 'src/app/models/objective-table.model';
import { RealTable } from '../../../models/real-table.model';
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
  montsInYears: string[];
  // SUBS
  subsPayments: Subscription = new Subscription();
  // HEADERS OBJECTIVE
  headersObjective: any[] = [];
  // HEADERS REAL
  headersReal: any[] = [];
  // VALUE TABLE OBJECTIVE
  objectiveValue: ObjectiveTable;
  // VALUES TABLE OBJECTIVE
  realValues: RealTable[] = [];

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
      this.infTableReal();
    });
  }

  /**
   * Get disctinct years hace payments
   */
  getYears() {
    let listY:string[] = utils.periodToYears(this.payments.map((item) => item.period));
    this.years = utils.listStringNotRepeat(listY.filter(function(elem, index, self) {return index === self.indexOf(elem)}));
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
    let savingHeader = headersValue
      .get('STATISTICS-PAYMENT.SAVING')
      .replace('<SAVING_PORCERT>', '20%');
    let perExpensiveHeader = headersValue
      .get('STATISTICS-PAYMENT.PERSONAL_EXPENSIVE')
      .replace('<PERS_EXPENSIVE_PORCERT>', '30%');
    let permExpensivegHeader = headersValue
      .get('STATISTICS-PAYMENT.PERMANENT_EXPENSIVE')
      .replace('<PERM_EXPENSIVE_PORCERT>', '50%');

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
    let natureGain = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.NATURE_GAIN',
    ]).get('ADD-CATEGORY.NATURE_GAIN');
    // EMPTY MODEL
    this.objectiveValue = new ObjectiveTable();
    // PAYMENTS OF YEAR SELECT
    let paymentsByFilter = this.payments.filter(
      (payment) =>
        utils.getYearByPeriod(payment.period) === this.yearSelected &&
        payment.nature === natureGain
    );

    if (paymentsByFilter.length > 0) {
      let averageEntry =
        paymentsByFilter.reduce((sum, item) => sum + item.quantity, 0) / this.getMonthWithGainsInYearSelect();
      this.objectiveValue = new ObjectiveTable(averageEntry);
    }
  }

  private getMonthWithGainsInYearSelect(): number {
    // VALUE GAIN
    let natureGain = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.NATURE_GAIN',
    ]).get('ADD-CATEGORY.NATURE_GAIN');

    let dates = this.payments
      .filter(
        (payment) =>
          payment.period.startsWith(this.yearSelected) &&
          payment.nature === natureGain
      )
      .map((payment) => payment.period);

    let months = utils.periodToMonths(dates);

    return new Set(months).size;
  }


  /**
   * INFORMATION TABLE OBJECTIVE
   */
  infTableReal() {
    this.getHeadersReal();
    this.getValuesReal();
  }

  getHeadersReal() {
    const headersValue = this.LiteralClass.getLiterals([
      'STATISTICS-PAYMENT.MONTH',
      'STATISTICS-PAYMENT.MONTH_GAINS',
      'STATISTICS-PAYMENT.PLUS',
      'STATISTICS-PAYMENT.MONTH_SAVE_OBJECTIVE',
      'STATISTICS-PAYMENT.MONTH_SAVE_REAL',
      'STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_OBJECTIVE',
      'STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_REAL',
      'STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_OBJECTIVE',
      'STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_REAL'
    ]);


    this.headersReal = [
      {
        key: 'period',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH'),
      },
      {
        key: 'monthGains',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_GAINS'),
      },
      {
        key: 'plusGains',
        value: headersValue.get('STATISTICS-PAYMENT.PLUS'),
      },
      {
        key: 'monthSaveObjective',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_SAVE_OBJECTIVE'),
      },
      {
        key: 'monthSaveReal',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_SAVE_REAL'),
      },
      {
        key: 'monthPersonalExpensiveObjective',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_OBJECTIVE'),
      },
      {
        key: 'monthPersonalExpensiveReal',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_REAL'),
      },
      {
        key: 'monthPermanentExpensiveObjective',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_OBJECTIVE'),
      },
      {
        key: 'monthPermanentExpensiveReal',
        value: headersValue.get('STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_REAL'),
      },
    ];
  }

  getValuesReal() {
    // VALUES Natures
    const natures: Map<string, string> = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.NATURE_GAIN','ADD-CATEGORY.NATURE_EXPENDITURE'
    ]);
    const gains: string = natures.get('ADD-CATEGORY.NATURE_GAIN');
    const expenditure: string = natures.get('ADD-CATEGORY.NATURE_EXPENDITURE');
    // VALUES types
    const types: Map<string, string> = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.TYPE_PERSONAL','ADD-CATEGORY.TYPE_PERMANENT'
    ]);
    const personal: string = types.get('ADD-CATEGORY.TYPE_PERSONAL');
    const permanent: string = types.get('ADD-CATEGORY.TYPE_PERMANENT');

    this.realValues = [];

    // GET PERIODS START WITH YEAR SELECTED
    let periods:string [] = utils.listStringNotRepeat(this.payments.filter(payment => payment.period.startsWith(this.yearSelected)).map(payment => payment.period).sort());

    periods.forEach(period => {
      // GAINS MONTH
      const monthGains = this.payments.filter(payment => payment.period === period && payment.nature === gains).reduce((sum, item) => sum + item.quantity, 0);

      // EXPENSIVE PERSONAL MONTH
      const personalExpensive = this.payments.filter(payment => payment.period === period && payment.nature === expenditure && payment.type === personal).reduce((sum, item) => sum + item.quantity, 0);
      // EXPENSIVE PERMANENT MONTH
      const permanentExpensive = this.payments.filter(payment => payment.period === period && payment.nature === expenditure && payment.type === permanent).reduce((sum, item) => sum + item.quantity, 0);
      
      // DIFERENCE BETWEEN MONTH GAINS - AVERAGE GAINS (PER MONTH)
      const plusGains = monthGains - this.objectiveValue.averageEntry;

      // SAVE MONTH = GAINS - (ALL EXPESIVE)
      const monthSaveReal = monthGains - (personalExpensive + permanentExpensive);

      
      // GET NAME MONTH
      let keyLiteral: string = 'MONTH.';
      let month = this.LiteralClass.getLiterals([keyLiteral.concat(utils.getMonthByPeriod(period))]).get(keyLiteral.concat(utils.getMonthByPeriod(period)));
      
      // SAVE DATA
      const dataReal: RealTable = new RealTable(month,monthGains,plusGains,monthSaveReal,personalExpensive,permanentExpensive);
      this.realValues.push(dataReal);
    });

  }

}
