import { Component } from '@angular/core';
import { Entry } from 'src/app/pages/entries/shared/entry.model';
import { EntryService } from 'src/app/pages/entries/shared/entry.service';
import { BaseReportPdfListComponent } from '../base-report-pdf-list/base-report-pdf-list.component';

@Component({
  selector: 'app-report-entry',
  templateUrl: './report-entry.component.html',
  styleUrls: ['./report-entry.component.css']
})
export class ReportEntryComponent extends BaseReportPdfListComponent<Entry> {

  constructor(private entryService: EntryService) { 
    super(entryService);
  }

  protected getData() {
    this.resources = this.resources.sort((a,b) => a.id - b.id);       //Ordena por ID de forma crescente
    
    return this.resources.map((obj) => {
      return [
        {text: obj.id, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.description, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.category.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: this.formatAmount(obj.amount), style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.date, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: this.formatPaid(obj.paid), style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
      ]
    })
  }

  formatAmount(amount: string): string{
    return "R$ " + amount;
  }

  formatPaid(paid: boolean): string{
    return paid == true? "Sim" : "Não";
  }
}
