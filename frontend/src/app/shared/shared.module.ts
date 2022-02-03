import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,    //Para poder usar form do Angular
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
