import { Directive, Input } from '@angular/core';
import { BaseResourceListComponent } from '../../base-resource-list/base-resource-list.component';

@Directive()        //http://pdfmake.org/playground.html
export abstract class BaseReportPdfListComponent<T> extends BaseResourceListComponent<T> {

  @Input('title') title: string;
  @Input('layout') layout: string = "lightHorizontalLines";
  @Input('columns') columns: string[] = [];
  @Input('width-columns') widthColumns: any[] = [];

  async gerarPDF(){
    //Importação assíncrona para evitar problema quando gera PDF com configurações no style do documento
    const pdfMake = (await import( 'pdfmake/build/pdfmake.min')).default
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
    pdfMake.vfs = pdfFonts.pdfMake.vfs

    pdfMake.createPdf(this.inicializarConfiguracoesDocument()).download();
  }

  inicializarConfiguracoesDocument(){
    const docDefinitios = {
      pageSize: "A4",
      pageMargins: [25, 50, 25, 40],    //left top right botton

      header: [this.reportTitle()],
      content: [this.details()],
      footer: [this.footer(1, 1)]
    }
    return docDefinitios;
  }

  reportTitle() {   //Pag atual e total de pags
    return {
      text: this.title,
      fontSize: 15,
      bold: true,
      margin: [25, 20, 0, 45],
      //alignment: 'center',
    }
  }

  details() { 
    return [
      {
        table: {
          headerRows: 1,                   //Qtd de linhas do header
          widths: this.widthColumns,       //widths - Largura da cada coluna. "*" calcula automaticamenteo espaçamento de cada
          body: [
            this.preencherColuna(),
            ...this.getData()                   //Operador spread concatena as duas listas
          ]
        },
        layout: this.layout
      }
    ]
  }

  preencherColuna(){
    return this.columns.map((col) => {
      return [
        {text: col, style: "tableHeader", fontSize: 10, alignment: "left"}
      ]
    })
  }

  footer(currentPage: number, pageCount: number) {   //Pag atual e total de pags
    return [
      {
        text: currentPage + "/" + pageCount,
        alignment: "right",
        fontSize: 9,
        margin: [0, 10, 20, 0]  
      }
    ]
  }

  protected abstract getData();       //Método a ser implementado pelas classes que estedem esta
}