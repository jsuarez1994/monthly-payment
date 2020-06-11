import { NgModule } from '@angular/core';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {MenubarModule} from 'primeng/menubar';


@NgModule({
  exports: [
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    MenubarModule
  ]
})
export class PrimeModule { }
