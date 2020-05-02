import { Component, OnInit, OnDestroy } from '@angular/core';
// ROUTE
import { ActivatedRoute, Router } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// CHART
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as chartOpt from '../payment/chart_options';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
// RXJS
import { Subscription } from 'rxjs';
// UTILS
import * as utils from '../../../shared/Utils/utils';

@Component({
  selector: 'app-history-payment',
  templateUrl: './history-payment.component.html',
  styleUrls: [],
})
export class HistoryPaymentComponent implements OnInit, OnDestroy {
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // LIST PERIODS
  periods: string[] = [];
  // CHART LINE
  barChartPlugins;
  barChartOptions: ChartOptions;
  barChartData: ChartDataSets[] = [];
  barChartType: ChartType;
  barChartLegend: boolean;
  barChartLabels: Label[] = [];
  // SUBSCRIPTION
  subsPeriods: Subscription = new Subscription();
  subsData: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
    private router: Router
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllPeriodsByFilter(this.route.snapshot.paramMap.get('description'));
  }

  ngOnDestroy() {
    this.subsData.unsubscribe();
    this.subsPeriods.unsubscribe();
  }

  /**
   * Get all periods by description
   * @param description 
   */
  getAllPeriodsByFilter(description: string) {
    this.subsPeriods = this.store.select('payments').subscribe( items => {
      items.payments.filter(payment => payment.description === description).forEach(item => {
        this.periods.push(item.period);
      });
      this.configChartByListPeriodsAndDescription(this.periods, description);
    });
  }

  configChartByListPeriodsAndDescription(periods: string[], description:string) {
    this.barChartPlugins = [pluginDataLabels];
    this.barChartOptions = chartOpt.optBarChart;
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartLabels = utils.periodToDate(this.periods);
    // DATA CHART
    let listValues: number[] = []
    this.subsData = this.store.select('payments').subscribe( items => {
      periods.forEach(period => {
        listValues.push(items.payments.filter(payment => payment.period === period && payment.description === description)[0].quantity);
      })
      this.barChartData.push({data: listValues, label: description});
    });
  }

}
