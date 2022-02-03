import { BaseResourceModel } from "../models/base-resource.model";

import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

//extends BaseResourceModel para o recourse do tipo T poder acessar o ID
export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

   /*apiPath - Qnd trabalha com dados em memória, por padrão utiliza o api/nome_recurso
   Injector - serviço do próprio Angular q é responsável por injetar as dependências. Vc pega um obj do tipo q deseja e verifica se já existe um obj instanciado, caso n, ele cria no momento */
  constructor(protected apiPath: string, protected injector: Injector){
    //Pega uma instância HttpClient. Isso eveita q os services (q estejam herdando BaseResourceService) precisem usar o HttpClient no construtor. Todos services utilizam HttpClient
    this.http = injector.get(HttpClient);               //O msmo injector poderia fazer: this.outraClasse = injector.get(OutraClasse);
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(            //pipe para manipular o obj
      catchError(this.handleError),
      map(this.jsonDataToResources)
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)            //Força o retorno do próprio obj atualizado 
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //Métodos PROTECTED-------------------------------------  
  /*O AngularInMemoryWebAPI devolve um objeto neutro (object) ou um array de objetos neutros (objects). O 'jsonDataToCategories' converte esse array de objetos neutros para objetos do tipo Category (de [object, object] para [category, category]. Com isso, vc tem acesso a métodos e atributos específicos dos objetos da classe Category.*/
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));           //Converte a lista de Json em lista do tipo T
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}