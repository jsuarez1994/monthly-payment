import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// NGRX
import { AppState } from 'src/app/redux/app.reducers';
import { Store } from '@ngrx/store';
// MODELS
import { Payment } from 'src/app/models/payment.model';
import { InformationPayment } from 'src/app/models/information-payment.model';
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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: [],
})
export class PaymentComponent implements OnInit {
  // INFORMATION PAYMENTS
  infoPay: InformationPayment;
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

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllNatures();
    this.configCharts();
    this.defaultFilters();
    this.getHeaders();
    this.getAllPayments();
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
    this.store.select('payments').subscribe((items) => {
      // GET PAYMENTS GAINS
      this.payments = items.payments.filter(
        (payments) =>
          payments.nature === this.natureSelect &&
          payments.period === this.periodSelect
      );
      // GET SUM ALL QUANTITIES
      this.sumQuantity = this.payments.reduce((sum, item) => sum + item.quantity,0);

      // GET INFO PAYMENTS
      let listPayGains: Payment[] = [];
      listPayGains = items.payments.filter((item) => item.nature === this.natures[0] && item.period === this.periodSelect);
      if(listPayGains.length > 0){
        let allGains = listPayGains.reduce((sum, item) => sum + item.quantity, 0);
        let porcentPermanent = allGains * 0.5;
        let porcentPersonal = allGains * 0.3;
        this.infoPay = new InformationPayment(allGains, porcentPermanent, porcentPersonal);
      }

      // IF NATURES IS EXPENDITURE
      if (this.natureSelect === this.natures[1]) {
        this.getChartExpenditure();
      }

      // CHART PAYMENTS
      this.getPaymentsCharts();
    });
  }

  /**
   * Get Headers
   */
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
  changePeriod(period: string) {
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

  /**
   * Get chart of payments expenditure
   */
  getChartExpenditure() {
    // CLEAR DATA
    this.doughnutChartData = [];
    let sumPersonal = 0;
    let sumPermanent = 0;

    this.payments.forEach((payment) => {
      // TYPE == PERSONAL
      if (payment.type === this.doughnutChartLabels[0]) {
        sumPersonal += payment.quantity;
        // TYPE == FIJO
      } else if (payment.type === this.doughnutChartLabels[1]) {
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
  generateReports(sumPersonal:number, sumPermanent:number) {
    this.reportPayments = '';

    const report = this.LiteralClass.getLiterals(['PAYMENT.REPORT_PAYMENT']);

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
}