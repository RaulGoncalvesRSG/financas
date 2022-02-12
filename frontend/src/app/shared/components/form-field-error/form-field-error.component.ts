import { Component, OnInit, Input } from '@angular/core';
//FormControl representa um campo do form
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  //Recebe um formControl como parâmetro
  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if( this.mustShowErrorMessage() )
      return this.getErrorMessage();
    else
      return null;
  }

  private mustShowErrorMessage(): boolean {
     //resourceForm.get('name') do html retorna um formControl. Então resourceForm.get('name').invalid pode ser usado como formControl.invalid
    return this.formControl.invalid && this.formControl.touched     //touched verifica se tocou no campo
  }

  private getErrorMessage(): string | null {
    if( this.formControl.errors.required )
      return "Campo obrigatório";

    else if( this.formControl.errors.email)
      return "Formato de email inválido"

    else if( this.formControl.errors.minlength){
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `Deve ter no mínimo ${requiredLength} caracteres`;
    }

    else if( this.formControl.errors.maxlength){
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `Deve ter no máximo ${requiredLength} caracteres`;
    }
  }
}