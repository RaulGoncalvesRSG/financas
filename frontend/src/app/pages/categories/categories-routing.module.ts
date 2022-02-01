import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  //Como já está dentro de "categories", coloca apenas a continuação da rota
  { path: "", component: CategoryListComponent },
   //Dentro do CategoryFormComponent verifica se o usuário está tentando criar ou editar a categoria. Essa forma é feita para evitar duplicação de código e um formulário poder criar e editar
  { path: "new", component: CategoryFormComponent },
  { path: ":id/edit", component: CategoryFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
