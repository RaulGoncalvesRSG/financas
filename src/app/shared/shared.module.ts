import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';
import { ReportCategoryComponent } from './components/reports_pdf/report-category/report-category.component';
import { ReportEntryComponent } from './components/reports_pdf/report-entry/report-entry.component';

@NgModule({
  declarations: [                 //Casses abstratas não são adicionadas no NgModule
    BreadCrumbComponent, 
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    ReportCategoryComponent,
    ReportEntryComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,    //Para poder usar form do Angular
    RouterModule,
  ],
  exports: [        //tds os módulos q importam o SharedModule tem acesso aos componentes do exports
    //Shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    //Shared components
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    ReportCategoryComponent,
    ReportEntryComponent,
  ]
})

//SharedModule guarda partes do sistema que podem ou não ser utilizado por algum outro componente principal (não são obrigatórios). O SharedModule não é importado no app.module, ele é importado no module de um page (ex: categories.module)
export class SharedModule { }
