import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class OrderService {

  private ordini: {prodotto: string; taglia: string; colore: string; immagine: string; data: Date}[] = [];

  constructor(){this.caricaOrdini();}

  aggiungiOrdine(order: {prodotto: string; taglia: string; colore: string; immagine: string; data: Date}): void{
    this.ordini.push(order);
    this.salvaOrdini(); 
  }

  getOrdine(): {prodotto: string; taglia: string; colore: string; immagine: string; data: Date}[]{
    return this.ordini;
  }

  private salvaOrdini(): void{
    localStorage.setItem('ordini', JSON.stringify(this.ordini));
  }

  private caricaOrdini(): void{

    const storedOrdini = localStorage.getItem('ordini');

    if(storedOrdini)
    {
      this.ordini = JSON.parse(storedOrdini);
    }
    
  }

}