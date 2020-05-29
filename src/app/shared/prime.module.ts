import { NgModule } from '@angular/core';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  exports: [
    TableModule,
    ConfirmDialogModule
  ]
})
export class PrimeModule { }
