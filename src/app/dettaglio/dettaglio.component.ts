import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScarpeService } from '../services/scarpe.service';
import { CarrelloService } from '../services/carrello.service';
import { IScarpa } from '../models/IScarpa';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dettaglio-scarpa',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.css']
})

export class DettaglioScarpaComponent implements OnInit{

  scarpa: IScarpa;

  constructor(private route: ActivatedRoute, private scarpeService: ScarpeService, 
    private carrelloService: CarrelloService, private authService: AuthService
  ){}

  slides: string[] = ['Scritta 1', 'Scritta 2', 'Scritta 3'];

  currentIndex: number = 0;

  sliderTransform: string = 'translateX(0%)';

  intervalId: any;

  prodotti: IScarpa[] = [];

  tuttiProdotti: IScarpa[] = [];

  isForward: boolean = true;

  taglie: string[] = [];

  colori_disponibili: string[] = [];

  recensioni: string[] = [];

  tagliaSelezionata: string = '';  

  coloreSelezionato: string = '';

  boxDettagliVisibile: boolean = false;

  boxDettagliVisibileDesktop: boolean = false;

  erroreTaglia: boolean = false;

  erroreColore: boolean = false;

  immagineSelezionata: string = '';

  ngOnInit(): void{

    this.startSlider();
  
    const id = this.route.snapshot.paramMap.get('id');
  
    if(id){

      this.scarpeService.getDetailById(+id).subscribe({

        next: (data) => {

          this.scarpa = data;
          this.taglie = data.taglieDisponibili.map(t => t.taglia);
          this.colori_disponibili = data.coloriDisponibili.map(c => c.colore);
          this.recensioni = data.recensioni; 
  
        },

        error: (err) => console.error("Errore nel caricamento della scarpa:", err)
        
      });

    }

  }
  
  ngOnDestroy(){
    clearInterval(this.intervalId);
  }

  startSlider(){

    this.intervalId = setInterval(() => {
      this.moveSlider();
    }, 3000);

  }

  moveSlider(){

    if(this.isForward){

      if(this.currentIndex < this.slides.length - 1) {
        this.currentIndex++;
      } 
      else {
        this.isForward = false;
        this.currentIndex--;
      }
    } 
    else {

      if(this.currentIndex > 0) 
      {
        this.currentIndex--;
      } 
      else 
      {
        this.isForward = true;
        this.currentIndex++;
      }

    }

    this.sliderTransform = `translateX(-${this.currentIndex * 100}%)`;

  }

  aggiungiAlCarrello(): void{

    if (this.scarpa && this.tagliaSelezionata && this.coloreSelezionato) {

      this.carrelloService.aggiungiAlCarrello(this.scarpa, this.tagliaSelezionata, this.coloreSelezionato);
      this.mostraBoxDettagli();
      this.mostraBoxDettagliDesktop();
      this.erroreTaglia = false;
      this.erroreColore = false;

    } 
    else {

      this.erroreTaglia = true;
      this.erroreColore = true;
      
    }

  }

  mostraBoxDettagli(): void{

    this.boxDettagliVisibile = true;

    setTimeout(() => {

      const popup = document.querySelector('.boxRiepilogo') as HTMLElement;

      if(popup) 
      {
        popup.classList.remove('slide-up'); 
        popup.classList.add('slide-down');
      }
      setTimeout(() => { this.boxDettagliVisibile = false; }, 500);
    }, 3000);

  }

  mostraBoxDettagliDesktop(): void{

    this.boxDettagliVisibileDesktop = true;

    setTimeout(() => {

      const popup = document.querySelector('.boxRiepilogoDesktop') as HTMLElement;

      if(popup) 
      {
        popup.classList.remove('slide-in'); 
        popup.classList.add('slide-out');   
      }

      setTimeout(() => { this.boxDettagliVisibileDesktop = false; }, 500);
    }, 3000);

  }

  mostraImmagineGrande(img: { url: string }){
    this.immagineSelezionata = img.url; 
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

}
