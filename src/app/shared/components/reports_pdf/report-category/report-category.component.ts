import { Component } from '@angular/core';
import { Category } from 'src/app/pages/categories/shared/category.model';
import { CategoryService } from 'src/app/pages/categories/shared/category.service';
import { BaseReportPdfListComponent } from '../base-report-pdf-list/base-report-pdf-list.component';

@Component({
  selector: 'app-report-category',
  templateUrl: './report-category.component.html',
  styleUrls: ['./report-category.component.css']
})
export class ReportCategoryComponent extends BaseReportPdfListComponent<Category> {

  constructor(private categoryService: CategoryService) { 
    super(categoryService);
  }

  protected getData() {
    this.resources = this.resources.sort((a,b) => a.id - b.id);       //Ordena por ID de forma crescente
    
    return this.resources.map((obj) => {
      return [
        {text: obj.id, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.name, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
        {text: obj.description, style: "tableHeader", fontSize: 9, margin: [0, 2, 0, 2]},
      ]
    })
  }
}
