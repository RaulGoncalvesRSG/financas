import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

//Inteceptador de resquisição http em memória
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDatabase } from "../in-memory-database";
import { NavbarComponent } from './components/navbar/navbar.component';

//Módulos carregados uma única vez no sistema
@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,          //Permite usar animação como o Calendar
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    RouterModule,
  ],
  exports: [      //Disponibiliza esses módulos para qm importar o CoreModule
    //Módulos compartilhados
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //Components compartilhados
    NavbarComponent,
  ]
})

//Core guarda componentes, models, serviços, guards, partes do projeto que são obrigatórios para o funcionamento do sistema. O CoreModule será importado no app.module.
export class CoreModule { }
