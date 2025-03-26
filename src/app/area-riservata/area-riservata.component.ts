import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CarrelloService } from '../services/carrello.service';
import { OrderService } from '../services/ordini.service';

@Component({
  selector: 'app-area-riservata',
  templateUrl: './area-riservata.component.html',
  styleUrls: ['./area-riservata.component.css']
})

export class AreaRiservataComponent implements OnInit {

  constructor(private authService: AuthService, private carrelloService: CarrelloService, private orderService: OrderService){}

  ordini: {prodotto: string; taglia: string; colore: string; quantita: number; immagine: string; data: Date}[] = [];

  @ViewChild('audioElement', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  audioPlaying: boolean = false;

  volume: number = 0.1;

  ngOnInit(): void {

    this.caricaOrdiniUtente();
  
    const audioStarted = localStorage.getItem('audioStarted');
    if (audioStarted === 'true') {
      this.playAudio();
    }
    
  }
  
  caricaOrdiniUtente(): void {

    this.orderService.getOrdiniUtente().subscribe({

      next: (ordiniDalBackend) => {

        this.ordini = ordiniDalBackend.map((ordine: any) => ({
          ...ordine,
          dataOrdine: new Date(ordine.dataOrdine)
        }));

      },

      error: (err) => {
        console.error("Errore nel recupero ordini:", err);
      }

    });

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

  logout(): void {
    this.authService.logout();
  }

}
