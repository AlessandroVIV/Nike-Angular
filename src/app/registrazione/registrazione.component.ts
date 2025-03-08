import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css'],
})

export class RegisterComponent {

  constructor(private authService: AuthService){}

  NomeUtente: string = '';

  password: string = '';

  isFocusedNomeUtente: boolean = false;

  isTouchedNomeUtente: boolean = false;

  nomeUtenteValido: boolean = false;

  isFocusedPassword: boolean = false;

  isTouchedPassword: boolean = false;

  passwordValida: boolean = false;

  NomeUtenteRegex: RegExp = /^[a-zA-Z0-9\s]{2,50}$/;

  passwordRegex: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{4,}$/

  isFormValid(): boolean{
    return this.NomeUtenteRegex.test(this.NomeUtente.trim()) && this.passwordRegex.test(this.password.trim());
  }

  get formValido(): boolean{
    return this.nomeUtenteValido && this.passwordValida;
  }
  
  onRegister(): void{
    this.authService.register(this.NomeUtente, this.password);
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

  onFocus(input: string): void{

    if(input === 'nomeUtente') 
    {
      this.isFocusedNomeUtente = true;
    } 
    else if(input === 'password') 
    {
      this.isFocusedPassword = true;
    }

  }

  onBlur(input: string): void{

    if(input === 'nomeUtente') 
    {
      this.isTouchedNomeUtente = true;
      this.isFocusedNomeUtente = false;
      this.nomeUtenteValido = this.NomeUtenteRegex.test(this.NomeUtente.trim());
    } 
    else if(input === 'password') 
    {
      this.isTouchedPassword = true;
      this.isFocusedPassword = false;
      this.passwordValida = this.passwordRegex.test(this.password.trim());
    }
    
  }

}
