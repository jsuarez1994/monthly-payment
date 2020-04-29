import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MODULES SHARED
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// COMPONENTS
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
// DATAPICKER MONTH
import { HammerModule } from '@angular/platform-browser';
import { IgxCalendarModule } from 'igniteui-angular';
// CHARTS
import { ChartsModule } from 'ng2-charts';
import { InputDatapickerComponent } from './components/input-datapicker/input-datapicker.component';
// MATERIAL
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [FooterComponent, NavbarComponent, InputDatapickerComponent],
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
    MaterialModule
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
    // MATERIAL
    MatNativeDateModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class SharedModule {}
