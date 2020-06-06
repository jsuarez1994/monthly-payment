import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MODULES SHARED
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// COMPONENTS
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InputDatapickerComponent } from './components/input-datapicker/input-datapicker.component';
import { TableCrudPaymentComponent } from './components/table-crud-payment/table-crud-payment.component';
import { TableCrudCategoryComponent } from './components/table-crud-category/table-crud-category.component';
// DATAPICKER MONTH
import { HammerModule } from '@angular/platform-browser';
import { IgxCalendarModule } from 'igniteui-angular';
// CHARTS
import { ChartsModule } from 'ng2-charts';
// MATERIAL
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
// PRIME
import { PrimeModule } from './prime.module';


@NgModule({
  declarations: [FooterComponent, NavbarComponent, InputDatapickerComponent, TableCrudPaymentComponent, TableCrudCategoryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    // DATAPICKER
    HammerModule,
    IgxCalendarModule,
    // CHARTS
    ChartsModule,
    // MATERIAL
    MatNativeDateModule,
    MaterialModule,
    // PRIME
    PrimeModule
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    // DATAPICKER
    HammerModule,
    IgxCalendarModule,
    // CHARTS
    ChartsModule,
    // COMPONENTS
    FooterComponent,
    NavbarComponent,
    InputDatapickerComponent,
    TableCrudPaymentComponent,
    TableCrudCategoryComponent,
    // MATERIAL
    MatNativeDateModule,
    MaterialModule,
    // PRIME
    PrimeModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class SharedModule {}
