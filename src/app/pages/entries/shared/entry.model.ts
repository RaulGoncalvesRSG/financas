import { BaseResourceModel } from "src/app/shared/models/base-resource.model";
import { Category } from "../../categories/shared/category.model";

export class Entry extends BaseResourceModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,        //Se está pago ou n
    public categoryId?: number,
    public category?: Category
  ){ 
    super();
  }

  //Dois tipos possíveis
  static types = {      
    expense: 'Despesa',
    revenue: 'Receita'
  };

  static fromJson(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);      //Retorna uma instância do obj a partir do json
  }

  //Função com o get utiliza dessa forma: object.paidText. Sem o get utiliza dessa forma: object.paidText()
  get paidText(): string {
    return this.paid ? 'Pago' : 'Pedente';
  }
}