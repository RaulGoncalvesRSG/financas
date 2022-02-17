import { OnInit, AfterContentChecked, Injector, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseResourceModel } from "../../models/base-resource.model"
import { BaseResourceService } from "../../services/base-resource.service"

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

//Classe base para formulários da aplicação
@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked{
  
  currentAction: string;                //ação q identifica se está editando ou criando o obj
  resourceForm: FormGroup;              //Responsável pelo formulário em si
  pageTitle: string;                    //msg de título da pag
  serverErrorMessages: string[] = null;     //Msgs de erro retornadas pelo servidor
  //bloqueia o btn após submeter o form, isso evita o usuário fazer várias requisições. O btn é liberado novamente depois q o servidor retornar uma resposta
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;         //construtor de formulário

  constructor(
    //Para fazer as configurações das dependências q tds formulários terão: ActivatedRoute, Router e FormBuilder
    protected injector: Injector,   
    //resource pode ser category ou entry. Ex. parâmetro: new Catergory()
    public resource: T,             
    //Classe de serviço
    protected resourceService: BaseResourceService<T>,
    //jsonDataToResourceFn converte os dados do Json do formulário para um tipo T do obj especificado (categoria ou lançamento)
    protected jsonDataToResourceFn: (jsonData) => T
  ) { 
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(){          //É chamado após o carregamento de tds os dados
    this.setPageTitle();
  }c

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new") {
      this.createResource();
    }
    else {                // currentAction == "edit"
      this.updateResource();
    }
  }

  //Define qual é a ação, se está criando ou editando um obj
  protected setCurrentAction() {
    //route.snapshot.url devolve um array contendo tds segmentos da url a partir da url base do módulo (categories): categories/1/edit ou categories/new
    if(this.route.snapshot.url[0].path == "new"){     //nome_recurso/new. Ex: categories/new
      this.currentAction = "new"
    }
    else {
      this.currentAction = "edit"                     //nome_recurso/1/edit
    }
  }

  protected loadResource() {
    if (this.currentAction == "edit") {
      
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get("id")))    //"+" converte o parâmetro em número
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource)      //Seta os valores da categoria no formulário para poder editar
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  protected setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else{
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string{
    return "Novo"
  }

  protected editionPageTitle(): string{
    return "Edição"
  }

  protected createResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionsForError(error)
      )
  }

  protected updateResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionsForError(error)
      )
  }
  
  protected actionsForSuccess(resource: T){
    toastr.success("Solicitação processada com sucesso!");
    //Pega a rota pai da página. Se está na rota "categories/new", pega o "categories"
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;        

    /*Força o recarregamento do componente para q tds variáveis sejam setadas novamente como se estivesse inicializando o form. O componente criado é recarregado em modo de edição
      nomesite.com/categories/new
      nomesite.com/categories
      nomesite.com/categories/:id/edit */
    
      //Redireciona para a página do component. skipLocationChange: true indica para n add essa navegação para o categories no histórico de navegação do navegador
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
        //Tem ID pq o recurso herda do BaseResourceModel, faz um redirecionamento de forma genérica de acordo com o baseComponentPath
      () => this.router.navigate([baseComponentPath, resource.id, "edit"])            
    )
  }

  protected actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;

    //OBS: o tratamento de erro é de acordo com o backend utilizado
    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } 
    else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
    }
  }

  //Constrói o formulário. Cada formulário possui suas confingurações de campos específicas. Métodos abstratos em classes abstratas é como se fosse um contrato assinado, a classe q está herdando é obrigada a implementar este método
  protected abstract buildResourceForm(): void;
}