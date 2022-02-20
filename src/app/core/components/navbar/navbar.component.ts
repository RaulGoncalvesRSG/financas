import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

//NabBar fica no módulo Core e não no Shared (compartilhado) pq é um componente que não é compartilhado em várias pages, mas sim um componente carregado uma única vez no projeto.
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}