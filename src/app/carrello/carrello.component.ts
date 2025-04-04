import { Component, OnInit } from '@angular/core';
import { CarrelloService } from '../services/carrello.service';
import { ScarpeService } from '../services/scarpe.service';
import { IScarpa } from '../models/IScarpa';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css']
})

export class CarrelloComponent implements OnInit{

  constructor(private carrelloService: CarrelloService, private scarpeService: ScarpeService, private authService: AuthService){}

  carrello: {scarpa: IScarpa; quantita: number; taglia: string; colore: string}[] = [];

  totaleConSconto: number | null = null;

  costoSpedizione: number = 0;

  codiceInserito: string = '';

  codiceSuggerito: string = 'CiaoAntonio01';

  codiceTentato: boolean = false;

  isMenuOpen: boolean = false;

  totaleProdotti: number = 0; 

  prodotti: IScarpa[];

  totaleVisualizzato: string = '—';

  ngOnInit(): void{

    this.caricaCarrello();
  
    this.carrelloService.calcolaCostoSpedizione(this.isAuthenticated());

    this.costoSpedizione = this.carrelloService.getCostoSpedizione();
  
    this.aggiornaPrezzoTotale();
    
  }

  toggleMenu(): void{
    this.isMenuOpen = !this.isMenuOpen;
  }

  applicaCodice(): void{

    this.codiceTentato = true;
  
    const input = document.querySelector("#Verde") as HTMLElement;
  
    const totaleConSpedizione = this.totaleProdotti + this.costoSpedizione;

    const sconto = this.carrelloService.applicaCodiceSconto(this.codiceInserito, totaleConSpedizione);
  
    if(sconto > 0) {
      this.totaleConSconto = totaleConSpedizione - sconto;

      if (input) input.style.borderColor = "green";

    } 
    else {
      this.totaleConSconto = null;

      if (input) input.style.borderColor = "red";

    }
    
  }
  
  caricaCarrello(): void {

    this.carrelloService.getDettagliCarrello().subscribe({

      next: (dettagli) => {

        this.carrello = dettagli;
        this.totaleProdotti = parseFloat(
          this.carrello.reduce((totale, item) => totale + item.scarpa.prezzo * item.quantita, 0).toFixed(2)
        );
        this.aggiornaPrezzoTotale();

      },

      error: (err) => {
        console.error("Errore nel caricamento carrello:", err);
      }

    });
    
  }
  
  aggiornaCostoSpedizione(): void{

    if(this.isAuthenticated()) {
      this.costoSpedizione = 0; 
    }
    else {
      this.costoSpedizione = parseFloat((Math.random() * (30 - 10) + 10).toFixed(0));
    }

    this.aggiornaPrezzoTotale(); 

  }

  getPrezzoTotale(): string{

    const totaleConSpedizione = this.totaleProdotti + this.costoSpedizione;

    if(this.totaleConSconto !== null) 
    {
      return `${this.totaleConSconto.toFixed(2)}€`;
    }

    return this.totaleProdotti > 0 ? `${totaleConSpedizione.toFixed(2)}€` : '—';

  }

  aggiornaPrezzoTotale(): void{

    const totaleConSpedizione = this.totaleProdotti + this.costoSpedizione;
  
    if(this.totaleConSconto !== null)
    {
      this.totaleVisualizzato = `${this.totaleConSconto.toFixed(2)}€`;
    } 
    else 
    {
      this.totaleVisualizzato = this.totaleProdotti > 0 ? `${totaleConSpedizione.toFixed(2)}€`: '—';
    }

  }

  incrementaQuantita(scarpaId: number, nomeScarpa: string, taglia: string, colore: string): void {

    this.carrelloService.incrementaQuantita(scarpaId, nomeScarpa, taglia, colore).subscribe({
      next: () => this.caricaCarrello(),
      error: (err) => console.error("Errore incremento:", err)
    });

  }
  
  decrementaQuantita(scarpaId: number, nomeScarpa: string, taglia: string, colore: string): void {

    this.carrelloService.decrementaQuantita(scarpaId, nomeScarpa, taglia, colore).subscribe({
      next: () => this.caricaCarrello(),
      error: (err) => console.error("Errore decremento:", err)
    });

  }
  
  svuotaCarrello(): void {

    this.carrelloService.svuotaCarrello().subscribe({

      next: () => {
        console.log("Carrello svuotato correttamente");
        this.caricaCarrello(); 
      },

      error: (err) => {
        console.error("Errore nello svuotamento:", err);
      }

    });

  }
  
  getNumeroArticoli(): number{
    return this.carrello.reduce((totale, item) => totale + item.quantita, 0);
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

}
