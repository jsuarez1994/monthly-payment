import { NgModule } from '@angular/core';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';


@NgModule({
  exports: [
    TableModule,
    ConfirmDialogModule,
    DialogModule
  ]
})
export class PrimeModule { }
