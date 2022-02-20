import { Component } from '@angular/core';
import { Entry } from 'src/app/pages/entries/shared/entry.model';
import { EntryService } from 'src/app/pages/entries/shared/entry.service';
import { BaseResourceListComponent } from '../../base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-report-entry',
  templateUrl: './report-entry.component.html',
  styleUrls: ['./report-entry.component.css']
})
export class ReportEntryComponent extends BaseResourceListComponent<Entry> {

  constructor(private entryService: EntryService) { 
    super(entryService);
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
      text: 'Lançamentos',
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
          widths: ["*", "*", "*", "*", "*", "*", "*", "*"],   //widths - Largura da cada coluna. "*" calcula automaticamenteo espaçamento de cada
          body: [
            [
              {text: "ID", style: "tableHeader", fontSize: 10},
              {text: "Nome", style: "tableHeader", fontSize: 10},
              {text: "Descrição", style: "tableHeader", fontSize: 10},
              {text: "Categoria", style: "tableHeader", fontSize: 10},
              {text: "Valor", style: "tableHeader", fontSize: 10},
              {text: "Data", style: "tableHeader", fontSize: 10},
              {text: "Pago", style: "tableHeader", fontSize: 10},
            ],
            ...this.dados()     //Operador spread concatena as duas listas
          ]
        },
        layout: "lightHorizontalLines"
      }
    ]
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

  dados() {
    this.resources = this.resources.sort((a,b) => a.id - b.id);       //Ordena por ID de forma crescente
    
    return this.resources.map((obj) => {
      return [
        {text: obj.id, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.description, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.category.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.amount, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.date, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.paid, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
      ]
    })
  }
}
