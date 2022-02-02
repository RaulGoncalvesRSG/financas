import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{
  
  currentAction: string;        //ação q identifica se está editando ou criando o obj
  categoryForm: FormGroup;      //Responsável pelo form em si
  pageTitle: string;            //msg q informa se está editando ou criando o obj
  serverErrorMessages: string[] = null;       //Msgs de erro retornada pelo servidor
  //bloqueia o btn após submeter o form, isso eveita q o usuário faça várias requisições. O btn é liberado novamente depois q o servidor retornar uma resposta
  submittingForm: boolean = false;            
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder      //construtor de formulário
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){                //É chamado após o carregamento de tds os dados
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new")
      this.createCategory();
    else                    //currentAction == "edit"
      this.updateCategory();
  }

  // PRIVATE METHODS

  //Define qual é a ação, se está criando ou editando um obj
  private setCurrentAction() {
    //route.snapshot.url devolve um array contendo tds segmentos da url a partir da url base do módulo (categories): categories/1/edit ou categories/new
    if(this.route.snapshot.url[0].path == "new")      //categories/new
      this.currentAction = "new"
    else
      this.currentAction = "edit"                     //categories/1/edit
  }

  //Constrói o formulário
  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))    //"+" converte o parâmetro em número
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category)          //Seta os valores da categoria no formulário para poder editar
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = "Cadastro de Nova Categoria"
    else{
      const categoryName = this.category.name || ""           //Garante uma str vazia caso a categoria ainda esteka null
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory(){
    //Object.assign cria uma nova categoria e atribui a ela os valores q foram preenchidos no categoryForm
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }
  
  private actionsForSuccess(category: Category){
    toastr.success("Solicitação processada com sucesso!");

    /*Força o recarregamento do componente para q tds variáveis sejam setadas novamente como se estivesse inicializando o form. O componente criado é recarregado em modo de edição
      nomesite.com/categories/new
      nomesite.com/categories
      nomesite.com/categories/:id/edit */
    
    //skipLocationChange: true indica para n add essa navegação para o categories no histórico de navegação do navegador
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    //OBS: o tratamento de erro é de acordo com o backend utilizado
    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, teste mais tarde."]
  }
}