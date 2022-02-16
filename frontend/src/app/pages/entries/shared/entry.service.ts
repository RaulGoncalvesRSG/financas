import { Injectable, Injector } from '@angular/core';

import { Observable } from "rxjs";
import { flatMap, catchError, map } from "rxjs/operators";

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { CategoryService } from "../../categories/shared/category.service";
import { Entry } from "./entry.model";

import * as moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) { 
    //Entry.fromJson - passar o nome da função sem () n executa a função, ela será guardada em um obj q pode executar a função. Neste caso, está apenas dizendo q é essa função q deverá ser executada qnd for solicitada
    super("api/entries", injector, Entry.fromJson);
  }

  //sendFn - função q faz o envio
  create(entry: Entry): Observable<Entry> {
    //bind(this) leva em consideração o this do EntryService
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this))
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    //Essa configuração do categoryService é apenas para api em memória
    return this.categoryService.getById(entry.categoryId).pipe(
      //Se utilizasse map em vez de flatMap, a função create retornaria Observable<Observable<Entry>>
      flatMap(category => {
        entry.category = category;      //Faz relacionamento entre entidades
        return sendFn(entry)            //Acessa o método da classe BaseResourceService: create ou update
      }),
      catchError(this.handleError)      //handleError é um método da classe BaseResourceService
    );
  }

  //Faz filtro de lançamentos de acordo com um determinado mês e ano
  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    //A forma ideal é pegar apenas os dados filtrados e retornados pelo serivdor e não utilizar o getAll. Ex: http.get("api/entries?mes=month&ano=year")
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      //moment faz um parse da string e retorna um obj Date. moment recebe como parâmetro: data e formato da data
      const entryDate = moment(entry.date, "DD/MM/YYYY");   
      const monthMatches = entryDate.month() + 1 == month;    //Como o mês se inicia do 0, soma +1
      const yearMatches = entryDate.year() == year;

      if(monthMatches && yearMatches) {
        return entry;         //Lançamento filtrado
      }
    })
  }
}