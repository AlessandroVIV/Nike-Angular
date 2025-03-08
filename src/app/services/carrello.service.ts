import { Injectable } from '@angular/core';
import { IScarpa } from '../models/IScarpa';
import { ScarpeService } from './scarpe.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class CarrelloService {

  constructor(private scarpeService: ScarpeService){}

  private carrello: {scarpa: {id:number}; quantita: number; taglia: string; colore: string;}[] = [];

  private costoSpedizione: number = 0; 

  private sconto: number = 0; 

  private codiceSconto: string | null = null; 

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

  applicaCodiceSconto(codice: string, totale: number): number{

    if(codice === 'CiaoAntonio01')
    {
      this.sconto = totale * 0.1; 
      this.codiceSconto = codice;
    } 
    else 
    {
      this.sconto = 0;
      this.codiceSconto = null;
    }

    return this.sconto;
    
  }

  getSconto(): number{
    return this.sconto;
  }

  getCodiceSconto(): string | null{
    return this.codiceSconto;
  }

  aggiungiAlCarrello(scarpa: IScarpa, taglia: string, colore: string): void{

    const index = this.carrello.findIndex(
      (item) =>
        item.scarpa.id === scarpa.id &&
        item.taglia === taglia &&
        item.colore === colore
    );

    if(index > -1) 
    {
      this.carrello[index].quantita++;
    } 
    else 
    {
      this.carrello.push({ scarpa: {id: scarpa.id}, quantita: 1, taglia, colore });
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

  svuotaCarrello(): void{
    this.carrello = [];
  }

  incrementaQuantita(scarpaId: number, taglia: string, colore: string): void{

    const index = this.carrello.findIndex(
      (item) => item.scarpa.id === scarpaId && item.taglia === taglia && item.colore === colore
    );

    if(index > -1) 
    {
      this.carrello[index].quantita++;
    }

  }

  decrementaQuantita(scarpaId: number, taglia: string, colore: string): void{

    const index = this.carrello.findIndex(
      (item) => item.scarpa.id === scarpaId && item.taglia === taglia && item.colore === colore
    );

    if(index > -1) 
    {
      this.carrello[index].quantita--;

      if (this.carrello[index].quantita === 0) 
      {
        this.carrello.splice(index, 1);
      }

    }

  }

  getDettagliCarrello(): Observable<{scarpa: IScarpa; quantita: number; taglia: string; colore: string}[]> {

    return this.scarpeService.getProdotti().pipe(

      map((prodotti) => {
        
        const dettagli = this.carrello.map((item) => {
        const scarpa = prodotti.find((p) => p.id === item.scarpa.id);

          return {
            scarpa: scarpa!,
            quantita: item.quantita,
            taglia: item.taglia,
            colore: item.colore,
          };

        });
      
        return dettagli;

      })

    );
    
  }
 
};