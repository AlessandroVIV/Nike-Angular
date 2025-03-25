import { Injectable } from '@angular/core';
import { IScarpa } from '../models/IScarpa';
import { ScarpeService } from './scarpe.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injector } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class CarrelloService {

  constructor(private scarpeService: ScarpeService,private http: HttpClient,private injector: Injector) {}

  private carrello: {scarpa: IScarpa; quantita: number; taglia: string; colore: string;}[] = [];

  private costoSpedizione: number = 0; 

  private sconto: number = 0; 

  private codiceSconto: string | null = null; 

  private totaleFinale: number = 0; 

  caricaCarrello(): void {

    if (this.authService.isAuthenticated()) {
  
      this.getDettagliCarrello().subscribe({
        next: (dettagli) => {
          this.carrello = dettagli;
  
          const totale = this.carrello.reduce((acc, item) => acc + item.scarpa.prezzo * item.quantita, 0);
  
          if (this.codiceSconto) {
            this.sconto = totale * 0.1;
            this.salvaDatiPromo(totale - this.sconto);
          }
        },
        error: (err) => {
          console.error("Errore nel caricamento dettagli carrello:", err);
        }
      });
  
    } else {
      const storedCart = localStorage.getItem('guest_cart');
      if (storedCart) {
        this.carrello = JSON.parse(storedCart);
      }
    }
  }
  
  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  setCostoSpedizione(costo: number): void{
    this.costoSpedizione = costo;
  }

  getCostoSpedizione(): number{
    return this.costoSpedizione; 
  }

  calcolaCostoSpedizione(authenticated: boolean): void{

    if(authenticated) 
    {
      this.costoSpedizione = 0;
    } 
    else
    {
      this.costoSpedizione = parseFloat((Math.random() * (30 - 10) + 10).toFixed(0));
    }

  }

  applicaCodiceSconto(codice: string, totale: number): number {

    if(codice === 'CiaoAntonio01') {

      this.sconto = totale * 0.1;
      this.codiceSconto = codice;
      this.salvaDatiPromo(totale - this.sconto);
    } 
    else {
      this.sconto = 0;
      this.codiceSconto = null;
      this.salvaDatiPromo(totale); 
    }
  
    return this.sconto;

  }
  
  private salvaDatiPromo(totaleFinale: number): void {

    this.totaleFinale = totaleFinale;
  
    localStorage.setItem('sconto', this.sconto.toString());
    localStorage.setItem('codiceSconto', this.codiceSconto || '');
    localStorage.setItem('totaleFinale', totaleFinale.toFixed(2));

  }
  
  getSconto(): number {
    return this.sconto || parseFloat(localStorage.getItem('sconto') || '0');
  }
  
  getCodiceSconto(): string | null {
    return this.codiceSconto || localStorage.getItem('codiceSconto');
  }
  
  getTotaleFinale(): number {
    const totale = this.carrello.reduce((acc, item) => acc + item.scarpa.prezzo * item.quantita, 0);
    const sconto = this.getSconto();
    return parseFloat((totale - sconto).toFixed(2));
  }
  

  resettaCodiceSconto(): void {

    this.codiceSconto = null;
    this.sconto = 0;
    this.totaleFinale = 0;
    localStorage.removeItem('codiceSconto');
    localStorage.removeItem('sconto');
    localStorage.removeItem('totaleFinale');

  }
  
  aggiungiAlCarrello(scarpa: IScarpa, taglia: string, colore: string): void {
     
    if(this.authService.isAuthenticated()) {

      const secretKey = this.authService.getSecretKey();

      const headers = new HttpHeaders({
        'Secret-Key': secretKey!
      });
  
      const utenteId = this.authService.getUtenteId();
  
      this.http.get<any>(`http://localhost:8080/carrello/${utenteId}`, { headers }).subscribe({

        next: (response) => {

          const carrelloId = response.carrelloId; 
  
          if(!carrelloId) {
            console.error("Carrello ID non trovato!");
            return;
          }
  
          const body = {
            prodotto: scarpa.nome,
            taglia: taglia,
            colore: colore,
            quantita: 1,
            prezzo: scarpa.prezzo
          };
  
          this.http.post(`http://localhost:8080/carrello/${carrelloId}/aggiungi`, body, { headers }).subscribe({

            next: () => {
              console.log("Prodotto aggiunto al carrello backend con successo!");
            },

            error: (err) => {
              console.error("Errore nell’aggiunta al carrello:", err);
            }

          });

        },

        error: (err) => {
          console.error("Errore nel recupero del carrello:", err);
        }

      });

    } 
    else {

      const index = this.carrello.findIndex(
        (item) => item.scarpa.id === scarpa.id && item.taglia === taglia && item.colore === colore
      );
  
      if(index > -1) {
        this.carrello[index].quantita++;
      } 
      else {

        this.carrello.push({
          scarpa,
          quantita: 1,
          taglia,
          colore
        });

      }
  
      localStorage.setItem('guest_cart', JSON.stringify(this.carrello));
      console.log("Prodotto aggiunto al carrello localStorage");

    }

  }
  
  rimuoviDalCarrello(scarpaId: number, taglia: string, colore: string): void{

    this.carrello = this.carrello.filter(
      (item) => !(item.scarpa.id === scarpaId && item.taglia === taglia && item.colore === colore)
    );

  }

  getCarrello():{scarpa: {id: number}; quantita: number; taglia: string; colore: string}[]{
    return this.carrello;
  }

  svuotaCarrello(): Observable<any> {

    if(this.authService.isAuthenticated()) {
  
      const utenteId = this.authService.getUtenteId();
      const secretKey = this.authService.getSecretKey();
  
      const headers = new HttpHeaders({
        'Secret-Key': secretKey!
      });
  
      localStorage.removeItem('guest_cart'); 
  
      return this.http.delete(`http://localhost:8080/carrello/${utenteId}/svuota`, { headers });
  
    } else {
  
      this.carrello = [];
      localStorage.removeItem('guest_cart');
      return of({ message: 'Carrello guest svuotato' }); 
  
    }
  
  }
  
  svuotaCarrelloFrontend(): void {
    this.carrello = [];
  }
  
  getCarrelloBackend(utenteId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/carrello/${utenteId}`);
  }
  
  getDettagliCarrello(): Observable<{scarpa: IScarpa; quantita: number; taglia: string; colore: string}[]> {

    if(this.authService.isAuthenticated()) {
      
      const utenteId = this.authService.getUtenteId();

      const secretKey = this.authService.getSecretKey();
  
      const headers = new HttpHeaders({
        'Secret-Key': secretKey!
      });
  
      return this.http.get<any>(`http://localhost:8080/carrello/${utenteId}`, { headers }).pipe(
  
        switchMap((response) => {

          const carrelloItems = response.prodotti; 
  
          return this.scarpeService.getProdotti().pipe(
  
            map((prodotti) =>

              carrelloItems.map((item: any) => {

                const scarpa = prodotti.find((p) => p.nome === item.prodotto);

                if (!scarpa) return null;
  
                return {
                  scarpa,
                  quantita: item.quantita,
                  taglia: item.taglia,
                  colore: item.colore
                };

              }).filter((i) => i !== null)

            )
  
          );

        })
  
      );
  
    } 
    else {
  
      return this.scarpeService.getProdotti().pipe(

        map((prodotti) => {

          const dettagli = this.carrello.map((item) => {

            const scarpa = prodotti.find((p) => p.id === item.scarpa.id);

            if (!scarpa) return null;
  
            return {
              scarpa,
              quantita: item.quantita,
              taglia: item.taglia,
              colore: item.colore
            };

          }).filter(item => item !== null);
  
          return dettagli;
        })
        
      );
  
    }
  
  }
  
  incrementaQuantitaBackend(itemId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/carrello/item/${itemId}/incrementa`, {});
  }
  
  decrementaQuantitaBackend(itemId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/carrello/item/${itemId}/decrementa`, {});
  }
  
  incrementaQuantita(scarpaId: number, nomeScarpa: string, taglia: string, colore: string): Observable<any> {

    return new Observable(observer => {
  
      if(!this.authService.isAuthenticated()) {

        const index = this.carrello.findIndex(
          item => item.scarpa.id === scarpaId && item.taglia === taglia && item.colore === colore
        );
  
        if(index !== -1) {

          this.carrello[index].quantita++;
          localStorage.setItem('guest_cart', JSON.stringify(this.carrello));
          observer.next({ item: this.carrello[index] });
          observer.complete();

        } 
        else {
          observer.error("Prodotto non trovato nel carrello guest");
        }
  
        return;

      }
  
      this.getItemIdFromBackend(nomeScarpa, taglia, colore).subscribe({

        next: (itemId) => {

          if(itemId !== null) {

            this.incrementaQuantitaBackend(itemId).subscribe({

              next: (res) => {
                observer.next(res); 
                observer.complete();
              },
              error: (err) => observer.error(err)
              
            });

          } 
          else {
            observer.error("Item non trovato per incremento");
          }
        }

      });

    });

  }
  
  decrementaQuantita(scarpaId: number, nomeScarpa: string, taglia: string, colore: string): Observable<any> {

    return new Observable(observer => {
  
      if(!this.authService.isAuthenticated()) {

        const index = this.carrello.findIndex(
          item => item.scarpa.id === scarpaId && item.taglia === taglia && item.colore === colore
        );
  
        if(index !== -1) {

          this.carrello[index].quantita--;
  
          if(this.carrello[index].quantita <= 0) {
            this.carrello.splice(index, 1); 
          }
  
          localStorage.setItem('guest_cart', JSON.stringify(this.carrello));
          observer.next({ eliminato: true });
          observer.complete();

        } 
        else {
          observer.error("Prodotto non trovato nel carrello guest");
        }
  
        return;

      }
  
      this.getItemIdFromBackend(nomeScarpa, taglia, colore).subscribe({

        next: (itemId) => {

          if(itemId !== null) {

            this.decrementaQuantitaBackend(itemId).subscribe({

              next: (res) => {
                observer.next(res); 
                observer.complete();
              },
              error: (err) => observer.error(err)

            });

          } 
          else {
            observer.error("Item non trovato per decremento");
          }

        }

      });
  
    });

  }
  
  private getItemIdFromBackend(nomeScarpa: string, taglia: string, colore: string): Observable<number | null> {

    const utenteId = this.authService.getUtenteId();

    const secretKey = this.authService.getSecretKey();

    const headers = new HttpHeaders({ 'Secret-Key': secretKey! });
  
    return this.http.get<any>(`http://localhost:8080/carrello/${utenteId}`, { headers }).pipe(

      map((res) => {

        const items = res.prodotti || [];
  
        const matchingItem = items.find(item =>
          item.prodotto === nomeScarpa &&
          item.taglia === taglia &&
          item.colore === colore
        );
  
        console.log("Items ricevuti:", items);
        return matchingItem ? matchingItem.id : null;

      })

    );

  }
  
  migraCarrelloGuestSuBackend(): void {

    const guestCart = localStorage.getItem('guest_cart');
  
    if (!guestCart || !this.authService.isAuthenticated()) return;
  
    const carrelloRaw = JSON.parse(guestCart);
  
    this.scarpeService.getProdotti().subscribe(prodotti => {
  
      const prodottiGuest = carrelloRaw.map((item: any) => {

        const scarpaCompleta = prodotti.find(p => p.id === item.scarpa.id);
  
        return {
          prodotto: scarpaCompleta?.nome || "N/A",
          taglia: item.taglia,
          colore: item.colore,
          quantita: item.quantita,
          prezzo: scarpaCompleta?.prezzo || 0
        };

      });
  
      const utenteId = this.authService.getUtenteId();

      const secretKey = this.authService.getSecretKey();

      const headers = new HttpHeaders({ 'Secret-Key': secretKey! });
  
      this.http.post(`http://localhost:8080/carrello/${utenteId}/migra`, prodottiGuest, { headers }).subscribe({
  
        next: () => {
          console.log("Prodotti guest migrati correttamente!");
          localStorage.removeItem('guest_cart');
          this.carrello = [];
          this.caricaCarrello(); 
        },
  
        error: (err) => {
          console.error("Errore durante la migrazione:", err);
        }
  
      });
  
    });
  
  }
  
  checkout(): Observable<any> {
    const utenteId = this.authService.getUtenteId();
    const secretKey = this.authService.getSecretKey();
  
    const headers = new HttpHeaders({ 'Secret-Key': secretKey! });
  
    return this.getDettagliCarrello().pipe( 
      switchMap((dettagliCompleti) => {
  
        const scontoTotale = this.getSconto(); 

        const totaleProdotti = dettagliCompleti.reduce((tot, item) => tot + item.scarpa.prezzo * item.quantita, 0);
        
        const prodottiConTotale = dettagliCompleti.map(item => {

          const totaleItem = item.scarpa.prezzo * item.quantita;
          const scontoProporzionale = (totaleItem / totaleProdotti) * scontoTotale;
          const prezzoTotaleScontato = totaleItem - scontoProporzionale;
        
          return {
            prodotto: item.scarpa.nome,
            taglia: item.taglia,
            colore: item.colore,
            quantita: item.quantita,
            prezzoUnitario: parseFloat(item.scarpa.prezzo.toFixed(2)), 
            prezzoTotale: parseFloat(prezzoTotaleScontato.toFixed(2))
          };
          
        });
        
        
        localStorage.removeItem('totaleUltimoOrdine');
        this.resettaCodiceSconto();
  
        return this.http.post(
          `http://localhost:8080/carrello/${utenteId}/checkout`,
          prodottiConTotale,
          { headers }
        ).pipe(tap((res) => console.log("📦 Checkout response:", res)));
      })
    );
  }
  
  
  
};