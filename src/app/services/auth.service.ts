import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  
  private readonly USERS_URL = 'http://localhost:3000/utenti'; 

  constructor(private router: Router, private http: HttpClient) {}

  register(NomeUtente: string, password: string): void{
   
    this.http.get<any[]>(this.USERS_URL).subscribe((users) => {

      console.log('Utenti letti dal server:', users); 
  
      const userExists = users.some((user) => user.nome === NomeUtente);
  
      if(userExists) 
      {
        console.log('Questo utente esiste già!');
      } 
      else 
      {
        const newUser = {nome: NomeUtente, password};

        this.http.post(this.USERS_URL, newUser).subscribe(() => {

          console.log('Utente aggiunto:', newUser); 
          this.router.navigate(['/login']); 
          
        });

      }

    });

  }
  
  login(NomeUtente: string, password: string): Promise<boolean>{

    return new Promise((resolve, reject) => {

      this.http.get<any[]>(this.USERS_URL).subscribe((users) => {

        console.log('Utenti presenti:', users);
  
        const user = users.find(
          (user) => user.nome === NomeUtente && user.password === password
        );
  
        if(user) 
        {
          const token = btoa(`${NomeUtente}:${password}`);
          localStorage.setItem(this.TOKEN_KEY, token);
          this.router.navigate(['/area-riservata']);
          resolve(true); 
        }
        else 
        {
          resolve(false); 
        }

      }, (error) => {
        console.error('Errore nella richiesta:', error);
        reject(false); 
      });

    });
    
  }
  
  isAuthenticated(): boolean{
    return !!localStorage.getItem(this.TOKEN_KEY); 
  }

  logout(): void{
    localStorage.removeItem(this.TOKEN_KEY); 
    this.router.navigate(['/']); 
  }

}
