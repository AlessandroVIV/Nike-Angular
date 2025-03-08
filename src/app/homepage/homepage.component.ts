import { Component, OnInit, OnDestroy } from '@angular/core';
import $ from 'jquery';
import { IScarpa } from '../models/IScarpa';
import { ScarpeService } from '../services/scarpe.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, OnDestroy {

  constructor (private ScarpeService: ScarpeService, private authService: AuthService){}

  slides: string[] = ['Scritta 1', 'Scritta 2', 'Scritta 3'];

  currentIndex: number = 0;

  sliderTransform: string = 'translateX(0%)';

  intervalId: any;

  isForward: boolean = true; 

  prodotti: IScarpa[];

  prodottiFiltratiBestSeller: IScarpa[];

  prodottiFiltratiNuoviArrivi: IScarpa[];

  CercaBestSeller: string = '';

  CercaNuoviArrivi: string = '';

  CategoriaSelezionata: string = '';

  ngOnInit(){

    this.startSlider();

    $(document).ready(function(){
    
      $("#scorri_giu").click(function(){
        
        $("html, body").animate({
          scrollTop: $("#destinazione").offset().top 
        }, 100); 

      });

    });

    $(document).ready(function(){
    
      $("#scorri_seller").click(function(){
        
        $("html, body").animate({
          scrollTop: $("#destinazione_seller").offset().top 
        }, 100); 

      });

    });

    $(document).ready(function(){
    
      $("#scorri_uscite").click(function(){
        
        $("html, body").animate({
          scrollTop: $("#destinazione_uscite").offset().top 
        }, 100); 

      });

    });

    $(document).ready(function(){
    
      $("#scorri_catalogo").click(function(){
        
        $("html, body").animate({
          scrollTop: $("#destinazione_catalogo").offset().top 
        }, 100); 

      });

    });

    $(document).ready(() => {

      const slider = $('#migliori_novita');
      const step = $('.descrizione_img').outerWidth(true) || 200; 
      
      $('.bottone-destra').on('click', () => {

        const maxScrollLeft = slider[0].scrollWidth - slider[0].clientWidth;
        const newScrollLeft = Math.min(slider.scrollLeft() + step, maxScrollLeft);
        slider.animate({ scrollLeft: newScrollLeft }, 400);

      });
    
      $('.bottone-sinistra').on('click', () => {

        const newScrollLeft = Math.max(slider.scrollLeft() - step, 0);
        slider.animate({ scrollLeft: newScrollLeft }, 400);

      });
      
    });

    $(document).ready(function(){

      const slider = $("#ultimeUsciteSlider");

      const firstItem = $(".scarpa_singola").first();

      const step = firstItem.length ? firstItem.outerWidth(true) : 1000; 
    
      $("#ultimeUscite-destra").click(function () {
    
        let newScrollLeft = slider.scrollLeft() + step;
        const maxScrollLeft = slider[0].scrollWidth - slider[0].clientWidth;
    
        if(newScrollLeft > maxScrollLeft) 
        {
          newScrollLeft = maxScrollLeft;
        }
    
        slider.animate({ scrollLeft: newScrollLeft }, 30);
    
      });
    
      $("#ultimeUscite-sinistra").click(function () {
    
        let newScrollLeft = slider.scrollLeft() - step;
    
        if(newScrollLeft < 0)
        {
          newScrollLeft = 0;
        }
    
        slider.animate({ scrollLeft: newScrollLeft }, 30);
    
      });
    
    });
    
    $(document).ready(function(){

      const slider = $("#scopriSportSlider");
      const firstItem = $(".scarpa_singola").first(); 
      const step = firstItem.length ? firstItem.outerWidth(true) : 1000; 
  
      $("#scopriSport-destra").click(function (){

          let newScrollLeft = slider.scrollLeft() + step;
          const maxScrollLeft = slider[0].scrollWidth - slider[0].clientWidth;
          
          if(newScrollLeft > maxScrollLeft) 
          {
            newScrollLeft = maxScrollLeft;
          }
          
          slider.animate({ scrollLeft: newScrollLeft }, 30);

      });
  
      $("#scopriSport-sinistra").click(function () {

          let newScrollLeft = slider.scrollLeft() - step;
          
          if(newScrollLeft < 0) 
          {
            newScrollLeft = 0;
          }
          
          slider.animate({ scrollLeft: newScrollLeft }, 30);

      });

    });

    $(document).ready(function(){

      const slider = $("#contenitore-slider"); 
      const firstItem = $(".descrizione_img").first(); 
      const step = firstItem.length ? firstItem.outerWidth(true) : 10000; 
  
      $(".bottone-slider.destra").click(function () {

        let newScrollLeft = slider.scrollLeft() + step;
        const maxScrollLeft = slider[0].scrollWidth - slider[0].clientWidth;

        if(newScrollLeft > maxScrollLeft) 
        {
          newScrollLeft = maxScrollLeft;
        }

        slider.stop().animate({ scrollLeft: newScrollLeft }, 30);

      });
  
      $(".bottone-slider.sinistra").click(function () {

        let newScrollLeft = slider.scrollLeft() - step;

        if(newScrollLeft < 0) 
        {
          newScrollLeft = 0;
        }

        slider.stop().animate({ scrollLeft: newScrollLeft }, 30);

      });

    });

    this.ScarpeService.getProdotti().subscribe({

      next: (data) => {

        this.prodotti = data;

        this.prodottiFiltratiBestSeller = this.prodotti.filter(prodotto => prodotto.bestSeller).sort((a, b) => a.bestSeller - b.bestSeller);

        this.prodottiFiltratiNuoviArrivi = this.prodotti.filter(prodotto => prodotto.nuovoArrivi === true)

        console.log(this.prodottiFiltratiBestSeller);

        console.log(this.prodottiFiltratiNuoviArrivi);

        console.log(data);

      },
      
      error: (err) => console.log(err),
      complete: () => console.log("Tutto funzionante"),


    });

  }

  cercaBestSeller(){

    this.prodottiFiltratiBestSeller = this.prodotti.filter((prodotto) => prodotto.bestSeller).filter((prodotto) =>
      prodotto.nome.toLowerCase().includes(this.CercaBestSeller.toLowerCase())
    );

  }

  cercaArrivi(){

    this.prodottiFiltratiNuoviArrivi = this.prodotti.filter((prodotto) => prodotto.nuovoArrivi).filter((prodotto) =>
      prodotto.nome.toLowerCase().includes(this.CercaNuoviArrivi.toLowerCase())
    );
    
  }

  prodottiFiltratiCategoria(){

    if(!this.CategoriaSelezionata)
    {
      return this.prodotti; 
    }

    return this.prodotti.filter(prodotto => prodotto.categoria === this.CategoriaSelezionata);

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
    
    if(this.isForward)
      {
        if (this.currentIndex < this.slides.length - 1)
        {
          this.currentIndex++;
        } 
        else 
        {
          this.isForward = false;
          this.currentIndex--; 
        }
      } 
      else 
      {
        if (this.currentIndex > 0) {
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

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

}