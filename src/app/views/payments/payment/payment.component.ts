import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// NGRX
import { AppState } from 'src/app/redux/app.reducers';
import { Store } from '@ngrx/store';
// MODELS
import { Payment } from 'src/app/models/payment.model';
import { InformationPayment } from 'src/app/models/information-payment.model';
import { User } from '../../../models/user.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// UTILS
import * as utils from '../../../shared/Utils/utils';
// CHART
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as chartOpt from './chart_options';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
// SWEETALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
//RXJS
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: [],
})
export class PaymentComponent implements OnInit, OnDestroy {
  // INFORMATION PAYMENTS
  infoPay: InformationPayment;
  // PAYMENTS
  allPayments: Payment[];
  payments: Payment[];
  sumQuantity: number;
  // CATEGORIES
  allCategories: Category[];
  // USER
  user: User;
  // HEADERS
  headersPayment: any[];
  headersCategory: any[];
  // LABELS PAYMENT
  labelsPayment: any[];
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // NATURES
  natures: string[];
  @ViewChild('naturePayment') naturePayment: ElementRef;
  natureSelectValue: string;
  natureSelectKey: number;
  keyGain: number;
  keyExpenditure: number;
  // TYPES
  keyPersonal: number;
  keyPermanent: number;
  // DATES
  periodSelect: string;
  // CHART DOUGHNUT
  doughnutChartLabels: string[] = [];
  doughnutChartData: number[] = [];
  reportPayments: string;
  // CHART LINE
  barChartPlugins;
  barChartOptions: ChartOptions;
  barChartData: ChartDataSets[] = [{ data: [0], label: 'Vacío' }];
  barChartType: ChartType;
  barChartLegend: boolean;
  barChartLabels: Label[] = [];
  //UNSUSBCRIBE
  subsPayments: Subscription = new Subscription();
  subsCategories: Subscription = new Subscription();
  subsUser: Subscription = new Subscription();
  // TITLE CHARTS
  titleExpenditure: string;
  titleGeneral: string;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy() {
    this.subsUser.unsubscribe();
    this.subsPayments.unsubscribe();
  }

  getUser() {
    this.subsUser = this.store.select('user').subscribe(user => {
      this.user = user.user;
      this.getAllNatures();
      this.configCharts();
      this.defaultFilters();
      // PAYMENT
      this.getHeadersPayment();
      this.getAllPayments();
      //CATEGORY
      this.getHeadersCategory();
      this.getAllCategories();
    });
  }

  /**
   * Get all types to combo
   */
  getAllNatures() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'PAYMENT.ALL_NATURES',
      'PAYMENT.NATURE_GAIN',
      'PAYMENT.NATURE_EXPENDITURE',
      'PAYMENT.NATURE_GAIN_KEY',
      'PAYMENT.NATURE_EXPENDITURE_KEY',
      'PAYMENT.TYPE_PERSONAL_KEY',
      'PAYMENT.TYPE_PERMANENT_KEY',
    ]);
    this.natures = [
      mapLiterals.get('PAYMENT.ALL_NATURES'),
      mapLiterals.get('PAYMENT.NATURE_GAIN'),
      mapLiterals.get('PAYMENT.NATURE_EXPENDITURE'),
    ];

    this.keyGain = Number(mapLiterals.get('PAYMENT.NATURE_GAIN_KEY'));
    this.keyExpenditure = Number(mapLiterals.get('PAYMENT.NATURE_EXPENDITURE_KEY'));

    this.keyPermanent = Number(mapLiterals.get('PAYMENT.TYPE_PERMANENT_KEY'));
    this.keyPersonal = Number(mapLiterals.get('PAYMENT.TYPE_PERSONAL_KEY'));

  }

  /**
   * Give values to filter by default
   */
  defaultFilters() {
    this.natureSelectValue = this.natures[0];
    this.natureSelectKey = -1;
    // Value period
    this.periodSelect = utils.currentDate();
  }

  configCharts() {
    // CONFIG CHART EXPENDITURE
    const mapLiterals = this.LiteralClass.getLiterals([
      'PAYMENT.TYPE_PERSONAL',
      'PAYMENT.TYPE_PERMANENT',
      'PAYMENT.PERIOD_SELECTED',
    ]);
    this.doughnutChartLabels = [
      mapLiterals.get('PAYMENT.TYPE_PERSONAL'),
      mapLiterals.get('PAYMENT.TYPE_PERMANENT'),
    ];

    // CONFIG CHART BAR
    this.barChartPlugins = [pluginDataLabels];
    this.barChartOptions = chartOpt.optBarChart;
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartLabels = [mapLiterals.get('PAYMENT.PERIOD_SELECTED')];
    this.barChartData = [];
  }

  /**
   * Get all payments by filters
   */
  getAllPayments() {
    this.subsPayments = this.store.select('payments').subscribe((items) => {
      // GET PAYMENTS GAINS
      this.allPayments = items.payments;
      this.payments = this.getPaymentsByFilter(items.payments);
      // GET SUM ALL QUANTITIES
      this.sumQuantity = this.payments.reduce((sum, item) => sum + item.quantity, 0);

      // GET INFO PAYMENTS
      if (this.payments.length > 0) {
        let listPayGains: Payment[] = [];
        listPayGains = items.payments.filter(
          (item) =>
            item.nature === this.keyGain && item.period === this.periodSelect
        );
        if (listPayGains.length > 0) {
          const allGains = listPayGains.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const porcentPermanent =
            allGains * (this.user.porcentPaymentPermanent / 100);
          const porcentPersonal =
            allGains * (this.user.porcentPaymentPersonal / 100);
          this.infoPay = new InformationPayment(
            allGains,
            porcentPermanent,
            porcentPersonal
          );
        } else {
          this.infoPay = new InformationPayment(0, 0, 0);
        }

        //CHART EXPENSIVES
        this.getChartExpenditure();
        // CHART PAYMENTS
        this.getPaymentsCharts();
      }
    });
  }

  getAllCategories() {
    this.subsCategories = this.store.select('categories').subscribe((items) => {
      this.allCategories = items.categories;
    });
  }

  /**
   * Get Headers
   */
  getHeadersPayment() {
    const headersValue = this.LiteralClass.getLiterals([
      'PAYMENT.HEADER_NATURE',
      'PAYMENT.HEADER_DESCRIPTION',
      'PAYMENT.HEADER_QUATITY',
      'PAYMENT.HEADER_TYPE',
      'COMMONS.OPERATIONS',
      'PAYMENT.CHART_PAYMENTS_GENERAL',
      'PAYMENT.CHART_PAYMENTS_EXPENDITURE',
    ]);
    this.headersPayment = [
      { field: 'nature', header: headersValue.get('PAYMENT.HEADER_NATURE') },
      { field: 'type', header: headersValue.get('PAYMENT.HEADER_TYPE') },
      {
        field: 'description',
        header: headersValue.get('PAYMENT.HEADER_DESCRIPTION'),
      },
      { field: 'quantity', header: headersValue.get('PAYMENT.HEADER_QUATITY') },
      { field: 'operations', header: '' }
    ];

    // TITLES CHARTS
    this.titleExpenditure = headersValue.get('PAYMENT.CHART_PAYMENTS_EXPENDITURE');
    this.titleGeneral = headersValue.get('PAYMENT.CHART_PAYMENTS_GENERAL');
  }

  /**
   * Get Headers
   */
  getHeadersCategory() {
    const headersValue = this.LiteralClass.getLiterals([
      'CATEGORY.HEADER_NATURE',
      'CATEGORY.HEADER_TYPE',
      'CATEGORY.HEADER_DESCRIPTION',
      'COMMONS.OPERATIONS'
    ]);
    this.headersCategory = [
      { field: 'nature', header: headersValue.get('CATEGORY.HEADER_NATURE') },
      { field: 'type', header: headersValue.get('CATEGORY.HEADER_TYPE') },
      { field: 'description', header: headersValue.get('CATEGORY.HEADER_DESCRIPTION') },
      { field: 'operations', header: '' }
    ];
  }

  /**
   * Get new period select in input datapicker
   * @param period
   */
  changePeriod(period: string) {
    this.periodSelect = period;
    this.findByFilter();
  }

  /**
   * Find in payments by new filters
   */
  findByFilter() {
    const natureSelect: string = this.naturePayment.nativeElement.value;

    if (natureSelect === this.natures[1]) { //GAINS
      this.natureSelectValue = this.natures[1];
      this.natureSelectKey = this.keyGain;
    } else if (natureSelect === this.natures[2]) { //EXPENDITURE
      this.natureSelectValue = this.natures[2];
      this.natureSelectKey = this.keyExpenditure;
    } else { // OTHER
      this.natureSelectValue = this.natures[0];
      this.natureSelectKey = -1;
    }

    // CALL GET ALL PAYMENTS
    this.getAllPayments();
  }

  /**
   * Get chart of payments expenditure
   */
  getChartExpenditure() {
    // CLEAR DATA
    this.doughnutChartData = [];
    let sumPersonal = 0;
    let sumPermanent = 0;

    this.allPayments.forEach((payment) => {
      // TYPE == PERSONAL
      if (payment.type === this.keyPersonal && payment.nature === this.keyExpenditure) {
        sumPersonal += payment.quantity;
        // TYPE == FIJO
      } else if (payment.type === this.keyPermanent && payment.nature === this.keyExpenditure) {
        sumPermanent += payment.quantity;
      }
    });
    this.doughnutChartData = [sumPersonal, sumPermanent];

    this.generateReports(sumPersonal, sumPermanent);
  }

  /**
   * Generate report by information payment
   * @param sumPersonal
   * @param sumPermanent
   */
  generateReports(sumPersonal: number, sumPermanent: number) {
    this.reportPayments = '';

    // TODO
    const report = this.LiteralClass.getLiterals([
      'PAYMENT.REPORT_PAYMENT_INIT',
      'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT',
      'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL',
    ]);

    // INIT REPORT
    let init: string = report.get('PAYMENT.REPORT_PAYMENT_INIT');
    // REPLACE VALUES
    init = init
      .replace('<ALLGAINS>', String(this.infoPay.allGains))
      .replace('<EXPENSIVE_PERMANENT>', String(this.infoPay.porcentPermanent))
      .replace('<EXPENSIVE_PERSONAL>', String(this.infoPay.porcentPersonal));

    // ********* BODY REPORT *********

    // PERMANENT
    let bodyPermanent: string = report.get(
      'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT'
    );
    // REPLACE VALUES
    bodyPermanent = bodyPermanent
      .replace('<EXPENSIVE_PERMANENT_OUT>', String(sumPermanent))
      .replace('<EXPENSIVE_PERMANENT>', String(this.infoPay.porcentPermanent));
    // RESULT REPORT PAYMENT
    const reportBodyPermanent = this.LiteralClass.getLiterals([
      'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT_GOOD',
      'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT_BAD',
    ]);
    let bodyPermanentResult = '';
    if (sumPermanent > this.infoPay.porcentPermanent) {
      // EXPENSIVE PLUS PERMITED
      bodyPermanentResult = reportBodyPermanent.get(
        'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT_BAD'
      );
      // REPLACE VALUES
      bodyPermanentResult = bodyPermanentResult.replace(
        '<REST_EXPENSIVE_PERMANENT>',
        String(sumPermanent - this.infoPay.porcentPermanent)
      );
    } else {
      bodyPermanentResult = reportBodyPermanent.get(
        'PAYMENT.REPORT_PAYMENT_BODY_PERMANENT_GOOD'
      );
      // REPLACE VALUES
      bodyPermanentResult = bodyPermanentResult.replace(
        '<REST_EXPENSIVE_PERMANENT>',
        String(this.infoPay.porcentPermanent - sumPermanent)
      );
    }
    // CONCAT BODY WITH RESULT
    bodyPermanent = bodyPermanent.concat(bodyPermanentResult);

    // PERSONAL
    let bodyPersonal: string = report.get(
      'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL'
    );
    // REPLACE VALUES
    bodyPersonal = bodyPersonal
      .replace('<EXPENSIVE_PERSONAL_OUT>', String(sumPersonal))
      .replace('<EXPENSIVE_PERSONAL>', String(this.infoPay.porcentPersonal));
    // RESULT REPORT PAYMENT
    const reportBodyPersonal = this.LiteralClass.getLiterals([
      'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL_GOOD',
      'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL_BAD',
    ]);
    let bodyPersonalResult = '';
    if (sumPersonal > this.infoPay.porcentPersonal) {
      // EXPENSIVE PLUS PERMITED
      bodyPersonalResult = reportBodyPersonal.get(
        'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL_BAD'
      );
      // REPLACE VALUES
      bodyPersonalResult = bodyPersonalResult.replace(
        '<REST_EXPENSIVE_PERSONAL>',
        String(sumPersonal - this.infoPay.porcentPersonal)
      );
    } else {
      bodyPersonalResult = reportBodyPersonal.get(
        'PAYMENT.REPORT_PAYMENT_BODY_PERSONAL_GOOD'
      );
      // REPLACE VALUES
      bodyPersonalResult = bodyPersonalResult.replace(
        '<REST_EXPENSIVE_PERSONAL>',
        String(this.infoPay.porcentPersonal - sumPersonal)
      );
    }
    // CONCAT BODY WITH RESULT
    bodyPersonal = bodyPersonal.concat(bodyPersonalResult);

    // RESULT REPORT
    this.reportPayments = init
      .concat(bodyPermanent)
      .concat(bodyPersonal)
      .trim();
  }

  /**
   * Get chart of payments
   */
  getPaymentsCharts() {
    // CLEAR DATA
    this.barChartData = [];

    this.payments.forEach((payment) => {
      const value = { data: [payment.quantity], label: payment.description };
      this.barChartData.push(value);
    });
  }

  private getPaymentsByFilter(list: Payment[]) {
    if (this.natureSelectKey === -1) {
      return list.filter((payment) => payment.period === this.periodSelect);
    } else {
      return list.filter((payment) => payment.period === this.periodSelect && payment.nature === this.natureSelectKey);
    }
  }

}
