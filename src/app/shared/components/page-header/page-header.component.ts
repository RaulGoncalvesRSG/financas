import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  //O nome da propriedade dentro do input é oq o usuário irá passar como parâmetro. Ex: <tag [page-title] = "valor"/>
  @Input('page-title') pageTitle: string;
  //Sempre q chamar este componente, por padrão, este btn será apresentado
  @Input('show-button') showButton: boolean = true;
  @Input('button-class') buttonClass: string;
  @Input('button-text') buttonText: string;
  @Input('button-link') buttonLink: string;       //Para onde o usuário será redirecionado qnd clicar

  constructor() { }

  ngOnInit() {
  }
}