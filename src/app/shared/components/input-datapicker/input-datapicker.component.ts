import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// DATAPICKER
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-input-datapicker',
  templateUrl: './input-datapicker.component.html',
  styleUrls: []
})
export class InputDatapickerComponent implements OnInit {

  @Output() newPeriod = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  changePeriod() {
    this.newPeriod.emit('fasdfa');
  }

}
