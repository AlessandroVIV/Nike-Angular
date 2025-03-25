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

  email: string = '';

  indirizzo: string = '';

  telefono: string = '';

  isFocusedNomeUtente: boolean = false;

  isTouchedNomeUtente: boolean = false;

  nomeUtenteValido: boolean = false;

  isFocusedPassword: boolean = false;

  isTouchedPassword: boolean = false;

  passwordValida: boolean = false;

  isFocusedEmail: boolean = false;

  isTouchedEmail: boolean = false;

  emailValida: boolean = false;

  isFocusedIndirizzo: boolean = false;

  isTouchedIndirizzo: boolean = false;

  indirizzoValido: boolean = false;

  isFocusedTelefono: boolean = false;

  isTouchedTelefono: boolean = false;
  
  telefonoValido: boolean = false;

  NomeUtenteRegex: RegExp = /^[a-zA-Z0-9\s]{2,50}$/;

  passwordRegex: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{4,}$/;

  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  indirizzoRegex: RegExp = /^.{5,100}$/; 

  telefonoRegex: RegExp = /^\+?\d{7,15}$/; 

  isFormValid(): boolean {

    return(
      this.NomeUtenteRegex.test(this.NomeUtente.trim()) &&
      this.passwordRegex.test(this.password.trim()) &&
      this.emailRegex.test(this.email.trim()) &&
      this.indirizzoRegex.test(this.indirizzo.trim()) &&
      this.telefonoRegex.test(this.telefono.trim())
    );

  }
  
  get formValido(): boolean{
    return this.nomeUtenteValido && this.passwordValida;
  }
  
  onRegister(): void{
    this.authService.register(this.NomeUtente, this.password, this.email, this.indirizzo, this.telefono);
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

  onFocus(input: string): void{

    if (input === 'nomeUtente') 
      this.isFocusedNomeUtente = true;
    else if (input === 'password') 
      this.isFocusedPassword = true;
    else if (input === 'email') 
      this.isFocusedEmail = true;
    else if (input === 'indirizzo') 
      this.isFocusedIndirizzo = true;
    else if (input === 'telefono') 
      this.isFocusedTelefono = true;

  }

  onBlur(input: string): void {

    if (input === 'nomeUtente') {
    this.isTouchedNomeUtente = true;
    this.isFocusedNomeUtente = false;
    this.nomeUtenteValido = this.NomeUtenteRegex.test(this.NomeUtente.trim());
    } 
    else if (input === 'password') {
    this.isTouchedPassword = true;
    this.isFocusedPassword = false;
    this.passwordValida = this.passwordRegex.test(this.password.trim());
    } 
    else if (input === 'email') {
    this.isTouchedEmail = true;
    this.isFocusedEmail = false;
    this.emailValida = this.emailRegex.test(this.email.trim());
    } 
    else if (input === 'indirizzo') {
    this.isTouchedIndirizzo = true;
    this.isFocusedIndirizzo = false;
    this.indirizzoValido = this.indirizzoRegex.test(this.indirizzo.trim());
    } 
    else if (input === 'telefono') {
    this.isTouchedTelefono = true;
    this.isFocusedTelefono = false;
    this.telefonoValido = this.telefonoRegex.test(this.telefono.trim());
    }

  }

}
