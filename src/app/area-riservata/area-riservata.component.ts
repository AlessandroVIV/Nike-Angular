import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CarrelloService } from '../services/carrello.service';

@Component({
  selector: 'app-area-riservata',
  templateUrl: './area-riservata.component.html',
  styleUrls: ['./area-riservata.component.css']
})

export class AreaRiservataComponent implements OnInit {

  constructor(private authService: AuthService, private carrelloService: CarrelloService){}

  ordini: {prodotto: string; taglia: string; colore: string; quantita: number; immagine: string; data: Date}[] = [];

  @ViewChild('audioElement', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  audioPlaying: boolean = false;

  volume: number = 0.1;

  prezzoTotaleUltimoOrdine: number = 0;

  ngOnInit(): void{

    this.caricaOrdiniDalLocalStorage();

    const audioStarted = localStorage.getItem('audioStarted');

    if(audioStarted === 'true') 
    {
      this.playAudio();
    }

    const totale = localStorage.getItem('totaleUltimoOrdine');
    this.prezzoTotaleUltimoOrdine = totale ? parseFloat(totale) : 0;

  }

  caricaOrdiniDalLocalStorage(): void{

    const ordiniSalvati = localStorage.getItem('ordini');

    if(ordiniSalvati) 
      
    {

      this.ordini = JSON.parse(ordiniSalvati).map((ordine: any) => ({
        ...ordine,
        data: new Date(ordine.data),
      }));

      this.sincronizzaQuantitaConCarrello();

    } 
    else 
    {
      this.sincronizzaConCarrello();
    }

  }

  sincronizzaQuantitaConCarrello(): void{

    this.carrelloService.getDettagliCarrello().subscribe({

      next: (carrelloDettagli) => {
      
        this.ordini.forEach((ordine, index) => {
          const corrispondenteCarrello = carrelloDettagli.find(item => 
            item.scarpa.nome === ordine.prodotto && 
            item.taglia === ordine.taglia &&
            item.colore === ordine.colore
          );

          if(corrispondenteCarrello) 
          {
            this.ordini[index].quantita = corrispondenteCarrello.quantita;
          }

        });

      
        this.salvaOrdiniNelLocalStorage();

      },

      error: (err) => console.log(err)

    });

  }

  sincronizzaConCarrello(): void{

    this.carrelloService.getDettagliCarrello().subscribe({

      next: (carrelloDettagli) => {

        const nuoviOrdini = carrelloDettagli.map(item => {
          
          return{
            prodotto: item.scarpa.nome,
            taglia: item.taglia,
            colore: item.colore,
            quantita: item.quantita,
            immagine: (Array.isArray(item.scarpa.immagini) && item.scarpa.immagini.length > 0) 
              ? item.scarpa.immagini[0].url 
              : 'assets/img/default.png',
            data: new Date()
          };

        });
  
        this.ordini = [...this.ordini, ...nuoviOrdini];
  
        this.salvaOrdiniNelLocalStorage();

      },

      error: (err) => console.log(err)
    });

  }
  
  salvaOrdiniNelLocalStorage(): void{
    localStorage.setItem('ordini', JSON.stringify(this.ordini));
  }
  
  playAudio(): void{

    const audio = this.audioRef.nativeElement;

    audio.volume = this.volume;

    audio.play()
      .then(() => {
        this.audioPlaying = true;
      })
      .catch(err => {
        console.log(err);
      });

  }

  setVolume(volume: number): void{
    this.volume = volume;
    this.audioRef.nativeElement.volume = this.volume;
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
    localStorage.removeItem('ordini');
  }

}
