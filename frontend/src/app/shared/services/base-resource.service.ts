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
  constructor(
    protected apiPath: string, 
    protected injector: Injector,
    //Função q recebe um json e revolve o tipo T (converte o json em uma instância do obj)
    protected jsonDataToResourceFn: (jsonData: any) => T
  ){
    //Pega uma instância HttpClient. Isso eveita q os services (q estejam herdando BaseResourceService) precisem usar o HttpClient no construtor. Todos services utilizam HttpClient
    this.http = injector.get(HttpClient);               //O msmo injector poderia fazer: this.outraClasse = injector.get(OutraClasse);
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(            //pipe para manipular o obj
      //O bind especifica qual o "this" (contexto) q deve ser utilizado. Se usar o "this" como parâmetro do bind, indica q dentro do jsonDataToResources será utilizado o "this" da classe instanciada, q pode ser o EntryService ou CategoryService
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource).pipe(
      map(() => resource),            //Força o retorno do próprio obj atualizado 
      catchError(this.handleError)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  //Métodos PROTECTED-------------------------------------  
   /*O AngularInMemoryWebAPI devolve um objeto neutro (object) ou um array de objetos neutros (objects). O 'jsonDataToCategories' converte esse array de objetos neutros para objetos do tipo Category (de [object, object] para [category, category]. Com isso, vc tem acesso a métodos e atributos específicos dos objetos da classe Category.*/
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => 
      resources.push(this.jsonDataToResourceFn(element))     //Instancia um obj a partir do json e devolve ele instanciado
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}