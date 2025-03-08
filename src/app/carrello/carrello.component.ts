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
  
    if(sconto > 0) 
    {
      this.totaleConSconto = totaleConSpedizione - sconto;

      if (input) input.style.borderColor = "green";

    } 
    else 
    {
      this.totaleConSconto = null;

      if (input) input.style.borderColor = "red";

    }
    
  }
  
  caricaCarrello(): void{

    const carrelloParziale = this.carrelloService.getCarrello();

    this.scarpeService.getProdotti().subscribe({

      next: (prodotti) =>{

        this.prodotti = prodotti

        this.carrello = carrelloParziale.map((item) => {
          const scarpaDettaglio = prodotti.find(
            (scarpa) => scarpa.id === item.scarpa.id
          );

          return {
            scarpa: scarpaDettaglio,
            quantita: item.quantita,
            taglia: item.taglia,
            colore: item.colore
          };

        });

        this.totaleProdotti = parseFloat(this.carrello.reduce((totale, item) => totale + item.scarpa.prezzo * item.quantita, 0).toFixed(2)
        );  

      },

      error: (err) => console.error('Non ha caricato, sveglia!')

    });

  }

  aggiornaCostoSpedizione(): void{

    if(this.isAuthenticated()) 
    {
      this.costoSpedizione = 0; 
    }
    else 
    {
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
  
  incrementaQuantita(scarpaId: number, taglia: string, colore: string): void{

    this.carrelloService.incrementaQuantita(scarpaId, taglia, colore);

    this.caricaCarrello();

  }

  rimuoviScarpa(scarpaId: number, taglia: string, colore: string): void{

    this.carrelloService.decrementaQuantita(scarpaId, taglia, colore);

    this.caricaCarrello();

  }
  
  svuotaCarrello(): void{

    this.carrelloService.svuotaCarrello();

    this.caricaCarrello();

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
