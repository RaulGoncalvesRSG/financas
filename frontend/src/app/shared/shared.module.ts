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

//SharedModule guarda partes do sistema que podem ou não ser utilizado por algum outro componente principal (não são obrigatórios). O SharedModule não é importado no app.module, ele é importado no module de um page (ex: categories.module)
export class SharedModule { }
