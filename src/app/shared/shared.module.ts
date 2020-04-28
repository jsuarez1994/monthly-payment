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
import { HammerModule } from "@angular/platform-browser";
import { IgxCalendarModule } from 'igniteui-angular';
// CHARTS
import { ChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [FooterComponent, NavbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    // DATAPICKER
    HammerModule,
    IgxCalendarModule,
    // CHARTS
    ChartsModule
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
    NavbarComponent
  ]
})
export class SharedModule { }
