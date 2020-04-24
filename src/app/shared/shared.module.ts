import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES SHARED
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
