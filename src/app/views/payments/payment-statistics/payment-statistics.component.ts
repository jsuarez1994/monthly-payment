import { Component, OnInit, OnDestroy } from '@angular/core';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// ROUTER
import { Router } from '@angular/router';
// MODELS
import { User } from '../../../models/user.model';
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
// SERVICES
import { UserService } from '../../../services/user.service';

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
  subsUser: Subscription = new Subscription();
  subsPayments: Subscription = new Subscription();
  // HEADERS OBJECTIVE
  headersObjective: any[] = [];
  // HEADERS REAL
  headersReal: any[] = [];
  // VALUE TABLE OBJECTIVE
  objectiveValue: ObjectiveTable;
  // VALUES TABLE OBJECTIVE
  realValues: RealTable[] = [];
  // USER
  user: User;
  // NATURE
  keyGain: number;
  keyExpenditure: number;
  // TYPES
  keyPersonal: number;
  keyPermanent: number;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.subsUser = this.store.select('user').subscribe(user => {
      this.user = user.user;
      this.getAllPayments();
    });
  }

  ngOnDestroy() {
    this.subsPayments.unsubscribe();
    this.subsUser.unsubscribe();
  }

  /**
   * Get all payments
   */
  getAllPayments() {
    this.subsPayments = this.store.select('payments').subscribe((items) => {
      this.payments = items.payments;
      this.getTypesAndNatureCode();
      this.getYears();
      this.infTableObjective();
      this.infTableReal();
    });
  }

  getTypesAndNatureCode() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'PAYMENT.NATURE_GAIN_KEY', 'PAYMENT.NATURE_EXPENDITURE_KEY',
      'PAYMENT.TYPE_PERSONAL_KEY', 'PAYMENT.TYPE_PERMANENT_KEY'
    ]);

    this.keyGain = Number(mapLiterals.get('PAYMENT.NATURE_GAIN_KEY'));
    this.keyExpenditure = Number(mapLiterals.get('PAYMENT.NATURE_EXPENDITURE_KEY'));

    this.keyPermanent = Number(mapLiterals.get('PAYMENT.TYPE_PERMANENT_KEY'));
    this.keyPersonal = Number(mapLiterals.get('PAYMENT.TYPE_PERSONAL_KEY'));
  }

  /**
   * Get disctinct years hace payments
   */
  getYears() {
    this.years = utils.listStringNotRepeat(
      utils.periodToYears(this.payments.map((item) => item.period))
    );
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
    const savingHeader = headersValue
      .get('STATISTICS-PAYMENT.SAVING')
      .replace('<SAVING_PORCERT>', String(this.user.porcentSaving).concat('%'));
    const perExpensiveHeader = headersValue
      .get('STATISTICS-PAYMENT.PERSONAL_EXPENSIVE')
      .replace('<PERS_EXPENSIVE_PORCERT>', String(this.user.porcentPaymentPersonal).concat('%'));
    const permExpensivegHeader = headersValue
      .get('STATISTICS-PAYMENT.PERMANENT_EXPENSIVE')
      .replace('<PERM_EXPENSIVE_PORCERT>', String(this.user.porcentPaymentPermanent).concat('%'));

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
    // EMPTY MODEL
    this.objectiveValue = new ObjectiveTable();
    // PAYMENTS OF YEAR SELECT
    const paymentsByFilter = this.payments.filter(
      (payment) =>
        utils.getYearByPeriod(payment.period) === this.yearSelected &&
        payment.nature === this.keyGain
    );

    if (paymentsByFilter.length > 0) {
      const averageEntry =
        paymentsByFilter.reduce((sum, item) => sum + item.quantity, 0) /
        this.getMonthWithGainsInYearSelect();
      this.objectiveValue = new ObjectiveTable(
        averageEntry,
        this.user.porcentSaving,
        this.user.porcentPaymentPermanent,
        this.user.porcentPaymentPersonal
      );
    }
  }

  private getMonthWithGainsInYearSelect(): number {
    const dates = this.payments
      .filter(
        (payment) =>
          payment.period.startsWith(this.yearSelected) &&
          payment.nature === this.keyGain
      )
      .map((payment) => payment.period);

    return new Set(utils.periodToMonths(dates)).size;
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
      'STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_REAL',
    ]);

    this.headersReal = [
      {
        key: 'period',
        value: '',
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
        value: headersValue.get(
          'STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_OBJECTIVE'
        ),
      },
      {
        key: 'monthPersonalExpensiveReal',
        value: headersValue.get(
          'STATISTICS-PAYMENT.MONTH_PERSONAL_EXPENSIVE_REAL'
        ),
      },
      {
        key: 'monthPermanentExpensiveObjective',
        value: headersValue.get(
          'STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_OBJECTIVE'
        ),
      },
      {
        key: 'monthPermanentExpensiveReal',
        value: headersValue.get(
          'STATISTICS-PAYMENT.MONTH_PERMANENT_EXPENSIVE_REAL'
        ),
      },
    ];
  }

  getValuesReal() {

    this.realValues = [];

    // GET PERIODS START WITH YEAR SELECTED
    const periods: string[] = utils.listStringNotRepeat(
      this.payments
        .filter((payment) => payment.period.startsWith(this.yearSelected))
        .map((payment) => payment.period)
        .sort()
    );

    periods.forEach((period) => {
      // GAINS MONTH
      const monthGains = this.payments
        .filter(
          (payment) => payment.period === period && payment.nature === this.keyGain
        )
        .reduce((sum, item) => sum + item.quantity, 0);

      // EXPENSIVE PERSONAL MONTH
      const personalExpensive = this.payments
        .filter(
          (payment) =>
            payment.period === period &&
            payment.nature === this.keyExpenditure &&
            payment.type === this.keyPersonal
        )
        .reduce((sum, item) => sum + item.quantity, 0);
      // EXPENSIVE PERMANENT MONTH
      const permanentExpensive = this.payments
        .filter(
          (payment) =>
            payment.period === period &&
            payment.nature === this.keyExpenditure &&
            payment.type === this.keyPermanent
        )
        .reduce((sum, item) => sum + item.quantity, 0);

      // DIFERENCE BETWEEN MONTH GAINS - AVERAGE GAINS (PER MONTH)
      const plusGains = monthGains - this.objectiveValue.averageEntry;

      // SAVE MONTH = GAINS - (ALL EXPESIVE)
      const monthSaveReal =
        monthGains - (personalExpensive + permanentExpensive);

      // GET NAME MONTH
      const keyLiteral: string = 'MONTH.'.concat(utils.getMonthByPeriod(period));
      const month = this.LiteralClass.getLiterals([keyLiteral]).get(keyLiteral);

      // SAVE DATA
      const dataReal: RealTable = new RealTable(
        month,
        monthGains,
        plusGains,
        monthSaveReal,
        personalExpensive,
        permanentExpensive,
        this.user.porcentSaving,
        this.user.porcentPaymentPermanent,
        this.user.porcentPaymentPersonal
      );
      this.realValues.push(dataReal);
    });
  }

  /**
   * Event dispatch when change year
   * @param $event
   */
  changeYear($event) {
    this.yearSelected = String($event.target.value);
    this.infTableObjective();
    this.infTableReal();
  }
}
