import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES SHARED
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
