import { Component, OnInit, Input } from '@angular/core';

//Cada tem item tem um texto e um link para ser direcionado
interface BreadCrumbItem {      //BreadCrumbItem é o nome da classe do bootstrap
  text: string;
  link?: string;
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: Array<BreadCrumbItem> = [];

  constructor() { }

  ngOnInit() {
  }

  //Recebe um array de itens pq esses itens são dinâmicos e podem variar de acordo com a pag
  isTheLastItem(item: BreadCrumbItem): boolean {
    const index = this.items.indexOf(item);       //Pega o indice do item
    return index + 1 == this.items.length;        //Se for igual, é o último item
  }
}