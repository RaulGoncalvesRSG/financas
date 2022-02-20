import { Component, Input } from '@angular/core';
import { Category } from 'src/app/pages/categories/shared/category.model';
import { CategoryService } from 'src/app/pages/categories/shared/category.service';
import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';
import { BaseResourceListComponent } from '../../base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-base-report-pdf-list',
  templateUrl: './base-report-pdf-list.component.html',
  styleUrls: ['./base-report-pdf-list.component.css']
})
export class BaseReportPdfListComponent<T> extends BaseResourceListComponent<Category> {

  @Input('title') title: string;
  @Input('columns') columns: string[] = [];
  @Input('width-columns') widthColumns: any[] = [];

  constructor(private categoryService: CategoryService) { 
    super(categoryService);
  }

  async gerarPDF(){
    //Importação assíncrona para evitar problema quando gera PDF com configurações no style do documento
    const pdfMake = (await import( 'pdfmake/build/pdfmake.min')).default
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
    pdfMake.vfs = pdfFonts.pdfMake.vfs
    
    const docDefinitios = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],    //left top right botton

      header: [this.reportTitle()],
      content: [this.details()],
      footer: [this.rodape(1, 5)]
    }

    pdfMake.createPdf(docDefinitios).download();
  }

  reportTitle() {   //Pag atual e total de pags
    return {
      text: this.title,
      fontSize: 15,
     // alignment: 'center',
      bold: true,
      margin: [15, 20, 0, 45]
    }
  }

  details() { 
    return [
      {
        table: {
          headerRows: 1,                   //Qtd de linhas do header
          widths: this.widthColumns,   //widths - Largura da cada coluna. "*" calcula automaticamenteo espaçamento de cada
          body: [
            this.preencherColuna(),
        //    ...this.dados()                   //Operador spread concatena as duas listas
          ]
        },
        layout: "lightHorizontalLines"
      }
    ]
  }

  preencherColuna(){
    return this.columns.map((col) => {
      return [
        {text: col, style: "tableHeader", fontSize: 10}
      ]
    })
  }

  rodape(currentPage: number, pageCount: number) {   //Pag atual e total de pags
    return [
      {
        text: currentPage + "/" + pageCount,
        alignment: "right",
        fontSize: 9,
        margin: [0, 10, 20, 0]  
      }
    ]
  }

  //protected abstract dados();
/*
  dados() {
    this.resources = this.resources.sort((a,b) => a.id - b.id);       //Ordena por ID de forma crescente
    
    return this.resources.map((obj) => {
      return [
        {text: obj.id, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.description, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
      ]
    })
  }*/
}