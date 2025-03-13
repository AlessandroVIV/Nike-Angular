import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  
  private readonly USERS_URL = 'http://localhost:8080';

  constructor(private router: Router, private http: HttpClient) {}

  register(NomeUtente: string, password: string): void {

    const newUser = { username: NomeUtente, password };
  
    this.http.post(`${this.USERS_URL}/register`, newUser, { responseType: 'text' }).subscribe({

      next: (response) => {
        console.log('Risposta del server:', response);
        this.router.navigate(['/login']);
      },

      error: (err) => {
        console.error('Errore nella registrazione:', err);
        alert('Errore nella registrazione!');
      }

    });
    
  }
  
  login(NomeUtente: string, password: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      const loginUser = { username: NomeUtente, password };
  
      this.http.post<{ secretKey: string }>(`${this.USERS_URL}/login`, loginUser).subscribe({

        next: (response) => {

          if(response.secretKey) 
          {
            localStorage.setItem(this.TOKEN_KEY, response.secretKey);
            this.router.navigate(['/area-riservata']);
            resolve(true);
          } 
          else 
          {
            resolve(false);
          }
        },

        error: (err) => {
          console.error('Errore nel login:', err);
          reject(false);

        }

      });

    });
    
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  
  logout(): void{
    localStorage.removeItem(this.TOKEN_KEY); 
    this.router.navigate(['/']); 
  }

}
