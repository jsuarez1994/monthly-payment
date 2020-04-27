import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MODULES SHARED
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// COMPONENTS
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';



@NgModule({
  declarations: [FooterComponent, NavbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    FooterComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
