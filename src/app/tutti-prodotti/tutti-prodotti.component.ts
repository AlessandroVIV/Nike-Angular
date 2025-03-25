import { Component, OnInit, OnDestroy } from '@angular/core';
import $ from 'jquery';
import { ScarpeService } from '../services/scarpe.service';
import { IScarpa } from '../models/IScarpa';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tutti-prodotti',
  templateUrl: './tutti-prodotti.component.html',
  styleUrl: './tutti-prodotti.component.css'
})

export class TuttiProdottiComponent implements OnInit, OnDestroy {

  constructor(private scarpeService: ScarpeService, private route: ActivatedRoute, private authService: AuthService) {}

  slides: string[] = ['Scritta 1', 'Scritta 2', 'Scritta 3'];

  currentIndex: number = 0;

  sliderTransform: string = 'translateX(0%)';

  intervalId: any;

  isForward: boolean = true; 

  prodotti: IScarpa[] = [];

  myDetail: IScarpa;

  isProdottiVisible: boolean = true;

  isDetailsVisible: boolean = false;

  tuttiProdotti: IScarpa[] = [];

  CercaScarpaProdotti: string = '';

  isMenuVisible: boolean = false;

  numeroRisultati: number = 0;

  filtroSelezionato: string = '';

  generiSelezionati: string[] = [];

  fascePrezzoSelezionate: string[] = [];

  coloriSelezionati: string[] = [];

  categorieSelezionate: string[] = [];

  ngOnInit(): void{

    this.startSlider();

    $(document).ready(function (){

      $("#scorri_giu").click(function () {
        $("html, body").animate({
          scrollTop: $("#destinazione").offset().top
        }, 100);
      });

      $("#scorri_seller").click(function () {
        $("html, body").animate({
          scrollTop: $("#destinazione_seller").offset().top
        }, 100);
      });

      $("#scorri_uscite").click(function () {
        $("html, body").animate({
          scrollTop: $("#destinazione_uscite").offset().top
        }, 100);
      });

      $("#scorri_catalogo").click(function () {
        $("html, body").animate({
          scrollTop: $("#destinazione_catalogo").offset().top
        }, 100);
      });

    });

    this.scarpeService.getProdotti().subscribe({

      next: (data) => {

        this.prodotti = data.map((scarpa) => ({
          ...scarpa,
          coloriDisponibili: Array.isArray(scarpa.coloriDisponibili) 
            ? scarpa.coloriDisponibili.map((c: any) => c.colore) 
            : [] 
        }));
      
        this.tuttiProdotti = [...this.prodotti];
        this.numeroRisultati = this.prodotti.length;
        console.log("Prodotti caricati:", this.prodotti);

      },

      error: (err) => console.log(err),

      complete: () => console.log("Tutto funzionante"),

    });
    
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

    if (this.isForward) {

      if (this.currentIndex < this.slides.length - 1) {
        this.currentIndex++;
      } 
      else {
        this.isForward = false;
        this.currentIndex--;
      }

    } 
    else {

      if (this.currentIndex > 0) {
        this.currentIndex--;
      } 
      else {
        this.isForward = true;
        this.currentIndex++;
      }

    }

    this.sliderTransform = `translateX(-${this.currentIndex * 100}%)`;

  }

  cercaScarpa(){

    if(!this.CercaScarpaProdotti.trim()) {

      this.prodotti = [...this.tuttiProdotti];

    } 
    else
    {

      this.prodotti = this.tuttiProdotti.filter((prodotto) =>
        prodotto.nome.toLowerCase().includes(this.CercaScarpaProdotti.toLowerCase())
      );

    }

    this.numeroRisultati = this.prodotti.length;

    if(this.numeroRisultati === 0){
    
      document.getElementById("avviso").style.display = "block"
      document.getElementById("bordoTop").style.borderTop  = "none"

    }
    else if(this.numeroRisultati === 1) {
      document.getElementById("risultato").textContent = "risultato trovato"
    }
    else{
      document.getElementById("risultato").textContent = "risultati trovati"
      document.getElementById("avviso").style.display = "none"
      document.getElementById("bordoTop").style.borderTop  = "solid 1px rgba(0, 0, 0, 0.1)"
    }

  }

  apriMenu(): void{

    this.isMenuVisible = !this.isMenuVisible;

    if(this.isMenuVisible)
    {
      document.body.style.overflow = 'hidden';
    } 
    else 
    {
      document.body.style.overflow = '';
    }

  }

  applicaFiltri(){

    this.prodotti = this.tuttiProdotti.filter((prodotto) => {

      const corrispondeFiltro =
        this.filtroSelezionato === 'nuovo_arrivi' ? prodotto.nuovoArrivi :
        this.filtroSelezionato === 'best_seller' ? prodotto.bestSeller :
        true;
  
      const corrispondeGenere =
        this.generiSelezionati.length > 0
          ? this.generiSelezionati.includes(prodotto.genere)
          : true;
  
      const corrispondePrezzo = this.fascePrezzoSelezionate.length > 0
        ? this.fascePrezzoSelezionate.some((fascia) => {
            if (fascia === '50-100') return prodotto.prezzo >= 50 && prodotto.prezzo <= 100;
            if (fascia === '100-150') return prodotto.prezzo > 100 && prodotto.prezzo <= 150;
            if (fascia === '150+') return prodotto.prezzo > 150;
            return false;
          })
        : true;
  
        const corrispondeColore = this.coloriSelezionati.length > 0
        ? this.coloriSelezionati.some((coloreSelezionato) =>
            prodotto.coloriDisponibili.some((coloreProdotto) => {
              const nomeColore = coloreProdotto.colore; 
              const coloriSeparati = nomeColore.split('/'); 
              return coloriSeparati.includes(coloreSelezionato);
            })
          )
        : true;
      
  
      const corrispondeCategoria = this.categorieSelezionate.length > 0
        ? this.categorieSelezionate.includes(prodotto.categoria)
        : true;
  
      return corrispondeFiltro && corrispondeGenere && corrispondePrezzo && corrispondeColore && corrispondeCategoria;
      
    });
  
    this.numeroRisultati = this.prodotti.length;
  
    if(this.numeroRisultati === 0) {
      document.getElementById("avviso").style.display = "block";
    } 
    else {
      document.getElementById("avviso").style.display = "none";
    }

  }
  
  aggiornaFiltroGenere(genere: string, isChecked: boolean){

    if(isChecked) {
      this.generiSelezionati.push(genere); 
    } 
    else {
      this.generiSelezionati = this.generiSelezionati.filter((g) => g !== genere); 
    }

    this.applicaFiltri(); 

  }

  aggiornaFiltroPrezzo(fascia: string, isChecked: boolean){

    if(isChecked) {
      this.fascePrezzoSelezionate.push(fascia); 
    } 
    else {
      this.fascePrezzoSelezionate = this.fascePrezzoSelezionate.filter((f) => f !== fascia); 
    }

    this.applicaFiltri();

  }

  aggiornaFiltroColore(colore: string, isChecked: boolean){

    if (isChecked) {
      this.coloriSelezionati.push(colore); 
    } 
    else {
      this.coloriSelezionati = this.coloriSelezionati.filter((c) => c !== colore); 
    }

    this.applicaFiltri(); 
    
  }

  aggiornaFiltroCategoria(categoria: string, isChecked: boolean){

    if(isChecked) {
      this.categorieSelezionate.push(categoria); 
    } 
    else {
      this.categorieSelezionate = this.categorieSelezionate.filter((c) => c !== categoria); 
    }

    this.applicaFiltri(); 

  }

  filtraProdotti(filtro: string){
    this.filtroSelezionato = filtro; 
    this.applicaFiltri(); 
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
  
}
