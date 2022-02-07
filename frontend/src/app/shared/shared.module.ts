import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';

@NgModule({
  declarations: [
    BreadCrumbComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,    //Para poder usar form do Angular
  ],
  exports: [        //tds os módulos q importam o SharedModule tem acesso aos componentes do exports
    //Shared modules
    CommonModule,
    ReactiveFormsModule,
    
    //Shared components
    BreadCrumbComponent,
  ]
})

//SharedModule guarda partes do sistema que podem ou não ser utilizado por algum outro componente principal (não são obrigatórios). O SharedModule não é importado no app.module, ele é importado no module de um page (ex: categories.module)
export class SharedModule { }
