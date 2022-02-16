import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from "../../entries/shared/entry.model";
import { EntryService } from "../../entries/shared/entry.service";

import currencyFormatter from "currency-formatter";       //currencyFormatter - trabalha formatação financeira

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;      //Total de despesas
  revenueTotal: any = 0;      //Total de receitas
  balance: any = 0;           //Saldo

  expenseChartData: any;      //Dados do gráfico de receitas
  revenueChartData: any;      //Dados do gráfico de despesas

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true       //Valor base no momento de exibir o gráfico é 0
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => 
      this.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;   //nativeElement pega o elemento html. value pega o valor atribuído para o campo
    const year = this.year.nativeElement.value;

    if(!month || !year) {
      alert('Você precisa selecionar o Mês e o Ano para gerar os relatórios')
    }
    else {
      //O getByMonthAndYear retorna um Entry[]. O bind(this) pega esse array retornado
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
    }
  }

  private setValues(entries: Entry[]){
    this.entries = entries;       //Preenche o array após ter gerado o gráfico
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance(){
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue') {
        //entry.amount retorna uma str em um formato q n é possível ler. unformat converte o formato da moeda atual para um formato q o JS consiga ler e realizer cálculos. Ex: converter 2,50 para 2.50
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })       //É receita
      } 
      else {
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })       //É despesa
      }
    });

    //Faz a formatação para mostrar no front end o valor com vírgula
    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL'});
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL'});
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL'});
  }

  //Configura os valores passado para o gráfico
  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  //cor do background
  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];

    this.categories.forEach(category => {
      //Filtrando lançamentos pela categoria e tipo
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)
      );

      //Se encontrar lançamentos no filtro, soma os valores de cada lançamento e add ao chartData. Essa verificação é pq pode haver categoria sem receita. Exibe apenas as categorias q tiverem receitas geradas para a categoria. Sendo assim, só entra na condição se existir lançamentos para a categoria q está sendo filtrada
      if(filteredEntries.length > 0){
        //reduce para já poder somar os valores retornados, fazer um loop e uma operação aritimética em cima dos valores
        const totalAmount = filteredEntries.reduce(
          //total é a soma; entry é cada obj; 0 é o valor inicial da soma
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        //Passa um array contendo objs e cada um. chartData possui objs da seguinte forma. Ex: [ {categoryName: "Freelas", totalAmount: 1200.00}, {categoryName: "Salário", totalAmount: 3500.00}, ]
        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    });
   
    return {
      labels: chartData.map(item => item.categoryName),     //Pega apenas o nome da categoria
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }
}