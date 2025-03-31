import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CarrelloService } from './carrello.service';
import { Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  
  private readonly USERS_URL = 'http://localhost:8080';

  constructor(private router: Router, private http: HttpClient, private injector: Injector) {}

  register(NomeUtente: string, password: string, email: string, indirizzo: string, telefono: string): void {

    const newUser = { 
      username: NomeUtente, 
      password, 
      email, 
      indirizzo, 
      telefono 
    };
  
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
  
      this.http.post<{secretKey: string, id: number, email: string, telefono: string, indirizzo: string}>(`${this.USERS_URL}/login`, loginUser).subscribe({
  
        next: (response) => {

          if(response.secretKey) {
  
            localStorage.setItem(this.TOKEN_KEY, response.secretKey);

            localStorage.setItem('utente_id', response.id.toString());
  
            localStorage.setItem('utente_info', JSON.stringify({
              email: response.email,
              telefono: response.telefono,
              indirizzo: response.indirizzo
            }));
  
            const carrelloService = this.injector.get(CarrelloService);

            carrelloService.migraCarrelloGuestSuBackend();
  
            const guestCheckout = localStorage.getItem('guest_checkout_pending');
  
            if(guestCheckout) {
  
              const ordine = JSON.parse(guestCheckout);
  
              const headers = {
                'Secret-Key': response.secretKey
              };
  
              this.http.post(`http://localhost:8080/carrello/${response.id}/checkout`, ordine, { headers }).subscribe({

                next: () => {
                  console.log("Checkout guest completato dopo il login");
                  localStorage.removeItem('guest_checkout_pending');
                  this.router.navigate(['/area-riservata']);
                  resolve(true);
                },

                error: (err) => {
                  console.error("Errore durante il salvataggio ordine guest:", err);
                  this.router.navigate(['/area-riservata']);
                  resolve(true);
                }

              });

  
            } 
            else {
              this.router.navigate(['/area-riservata']);
              resolve(true);
            }
  
          } 
          else {
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

  getSecretKey(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUtenteId(): string | null {
    return localStorage.getItem('utente_id');
  }

  getUtenteInfo(): { email: string, telefono: string, indirizzo: string } | null {
    const utenteInfo = localStorage.getItem('utente_info');
    return utenteInfo ? JSON.parse(utenteInfo) : null;
  }
  
  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('utente_id');
    const carrelloService = this.injector.get(CarrelloService);
    carrelloService.svuotaCarrelloFrontend();
    this.injector.get(CarrelloService).resettaCodiceSconto();
    this.router.navigate(['/']);

  } 

}
