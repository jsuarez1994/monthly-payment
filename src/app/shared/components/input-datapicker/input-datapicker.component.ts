import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
// DATAPICKER
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import * as fomatData from './format';
import { FormControl } from '@angular/forms';
import * as utils from '../../Utils/utils';

@Component({
  selector: 'app-input-datapicker',
  templateUrl: './input-datapicker.component.html',
  styleUrls: ['./input-datapicker.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: fomatData.format },
  ],
})
export class InputDatapickerComponent implements OnInit {
  @Output() newPeriod = new EventEmitter<any>();
  date = new FormControl(_moment());

  constructor() {}

  ngOnInit(): void {}

  chosenYearHandler(normalizedYear: _moment.Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();

    const month = normalizedMonth.month()+1;
    const year = normalizedMonth.year();

    this.changePeriod(utils.setPeriod(month, year));
  }

  changePeriod(period: string) {
    this.newPeriod.emit(period);
  }
}
