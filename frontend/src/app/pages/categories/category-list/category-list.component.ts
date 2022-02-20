import { Component } from '@angular/core';

import { BaseResourceListComponent } from "../../../shared/components/base-resource-list/base-resource-list.component";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { jsPDF } from "jspdf";

//import {PaginatorModule} from 'primeng/paginator';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseResourceListComponent<Category> {

  documentPDF: any;

  constructor(private categoryService: CategoryService) { 
    super(categoryService);
  }

  gerarPDF(){
    this.configurarPDF()

    var lin = 100, col = 60, incrementa = 20
    this.resources = this.resources.sort((a,b) => a.id - b.id);       //Ordena por ID de forma crescente

    //var pageHeight = this.documentPDF.internal.pageSize.height;

    this.resources.forEach(obj => {
      this.adicionarObjNoPDF(obj, lin, col, incrementa)
      lin += (incrementa * 4);      //Espaçamento entre os objetos
    })

    this.documentPDF.save("Lista de Categorias.pdf");                 //Título do arquivo
  }

  configurarPDF(){
    //Primeiro parâmetro do jsPDF é o tipo da folha
    this.documentPDF = new jsPDF("p", "pt", "a4", false);
    this.documentPDF.setFont("Helvertica", "bold");                   //Negrito
    this.documentPDF.text("Lista de Categorias", 240, 45);            //Título inicial da pag
    this. documentPDF.setFont("Helvertica", "normal");
  }

  adicionarObjNoPDF(obj: Category, lin: number, col: number, incrementa: number) {
    this.documentPDF.text("ID: " + obj.id, col, lin);
    lin += incrementa;

    this.documentPDF.text("Nome: " + obj.name, col, lin);
    lin += incrementa;

    this.documentPDF.text("Descrição: " + obj.description, col, lin);
    lin += incrementa;
  }
}