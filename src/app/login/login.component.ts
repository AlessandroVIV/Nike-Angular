import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {

  constructor(private authService: AuthService){}

  NomeUtente: string = '';

  password: string = '';

  isFocusedNomeUtente: boolean = false;

  isTouchedNomeUtente: boolean = false;

  nomeUtenteValido: boolean = true;

  isFocusedPassword: boolean = false;

  isTouchedPassword: boolean = false;

  passwordValida: boolean = true;

  NomeUtenteRegex: RegExp = /^[a-zA-Z0-9\s]{2,50}$/;

  passwordRegex: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{4,}$/;

  isFormValid(): boolean{
    return this.NomeUtenteRegex.test(this.NomeUtente.trim()) && this.passwordRegex.test(this.password.trim());
  }

  async onLogin(): Promise<void>{

    this.isTouchedNomeUtente = true;

    this.isTouchedPassword = true;

    if(this.isFormValid()) {

      try{

        const success = await this.authService.login(this.NomeUtente, this.password);

        if(!success) {

          this.nomeUtenteValido = false;
          this.passwordValida = false;

        }

      } 
      catch (error) {

        console.error('Errore durante il login:', error);
        this.nomeUtenteValido = false;
        this.passwordValida = false;

      }

    }

  }

  onFocus(input: string): void{

    if(input === 'nomeUtente') {

      this.isFocusedNomeUtente = true;
      this.nomeUtenteValido = true; 

    } 
    else if(input === 'password') {

      this.isFocusedPassword = true;
      this.passwordValida = true; 

    }

  }

  onBlur(input: string): void{

    if(input === 'nomeUtente') {

      this.isTouchedNomeUtente = true;
      this.isFocusedNomeUtente = false;
      this.nomeUtenteValido = this.NomeUtenteRegex.test(this.NomeUtente.trim());

    } 
    else if(input === 'password'){

      this.isTouchedPassword = true;
      this.isFocusedPassword = false;
      this.passwordValida = this.passwordRegex.test(this.password.trim());

    }
    
  }

}
