import { Component, OnInit } from '@angular/core';
import { CarrelloService } from '../services/carrello.service';
import { IScarpa } from '../models/IScarpa';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/ordini.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css']
})

export class PagamentoComponent implements OnInit {

  constructor(private carrelloService: CarrelloService,  private router: Router, private authService: AuthService, private orderService: OrderService){}

  carrello: {scarpa: IScarpa; quantita: number; taglia: string; colore: string}[] = [];

  costoSpedizione: number = 0;

  totaleConSpedizione: number = 0; 

  totaleProdotti: number = 0;

  popupVisibile: boolean = false;

  isRitiroVisible: boolean = false;

  isSpedizioneVisible: boolean = true;

  scrittaTop: string = '';

  isFocusedNome: boolean = false;

  isFocusedCognome: boolean = false;

  isFocusedIndirizzo: boolean = false;

  isFocusedRitiro: boolean = false;

  isFocusedEmail: boolean = false;

  isFocusedTelefono: boolean = false;

  isButtonActive: boolean = false;

  scrittaTop2: string = ''; //Nome

  scrittaTop3: string = ''; //Cognome

  scrittaTop4: string = ''; //Indirizzo

  scrittaTop5: string = ''; //Email

  scrittaTop6: string = ''; //Telefono

  nomeRegex: RegExp = /^[a-zA-Z\s]{2,50}$/; 

  cognomeRegex: RegExp = /^[a-zA-Z\s]{2,50}$/;

  indirizzoRegex: RegExp = /^[\w\s,.-]{5,100}$/; 

  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

  telefonoRegex: RegExp = /^[0-9]{8,15}$/; 

  nomeValido: boolean = false;

  cognomeValido: boolean = false;

  indirizzoValido: boolean = false;

  emailValido: boolean = false;
  
  telefonoValido: boolean = false;

  isTouchedNome: boolean = false;

  isTouchedCognome: boolean = false;

  isTouchedIndirizzo: boolean = false;

  isTouchedEmail: boolean = false;

  isTouchedTelefono: boolean = false;

  isFormCompilato: boolean = false;

  isPostoScelto: boolean = false;

  paeseScelto: string = 'Italia';

  paesi: string[] = [
    'Italia', 'Australia', 'Austria', 'Belgio', 'Brasile', 'Canada',
    'Danimarca', 'Finlandia', 'Francia', 'Germania', 'Grecia', 'Irlanda',
    'Lussemburgo', 'Norvegia', 'Paesi Bassi', 'Polonia', 'Portogallo',
    'Regno Unito', 'Repubblica Ceca', 'Repubblica di Corea'
  ];

  metodoSelezionato: string = '';

  numeroCarta: string = '';
  
  numeroCartaValido: boolean = false;

  isFocusedNumeroCarta: boolean = false;

  isTouchedNumeroCarta: boolean = false;

  numeroCartaRegex: RegExp = /^[0-9]{13,19}$/;

  dataCarta: string = '';

  dataCartaValida: boolean = false;

  isFocusedDataCarta: boolean = false;

  isTouchedDataCarta: boolean = false;  
  
  dataCartaRegex: RegExp = /^(0[1-9]|1[0-2])\/\d{2}$/;

  cvvCarta: string = ''; 

  cvvCartaValido: boolean = false;

  isFocusedCvvCarta: boolean = false;

  isTouchedCvvCarta: boolean = false;

  cvvCartaRegex: RegExp = /^[0-9]{3,4}$/;

  isCartaButtonActive: boolean = false;

  isMetodoScelto: boolean = false;

  immagineMetodoFinale: string = '';

  mostraSoloMetodoScelto: boolean = false;

  mostraVerificaOrdine: boolean = false;

  prodottoSelezionato = ""; 

  tagliaSelezionata = "";              

  coloreSelezionato = "";

  totaleOrdine: number;

  ngOnInit(): void{

    this.carrelloService.getDettagliCarrello().subscribe((dettagli) => {

      this.carrello = dettagli;
      this.costoSpedizione = this.carrelloService.getCostoSpedizione();
      this.calcolaTotaleConSpedizione();

    });
    
  }

  calcolaTotaleConSpedizione(): void{

    this.totaleProdotti = this.carrello.reduce(
      (totale, item) => totale + item.scarpa.prezzo * item.quantita,
      0
    );
  
    const sconto = this.carrelloService.getSconto();

    this.totaleConSpedizione = parseFloat(
      (this.totaleProdotti + this.costoSpedizione - sconto).toFixed(2)
    );

  }

  aggiornaCostoSpedizione(): void{

    if(this.isAuthenticated()) 
    {
      this.costoSpedizione = 0; 
    }
 
    this.calcolaTotaleConSpedizione();

  }

  getSconto(): number{
    return this.carrelloService.getSconto();
  }

  getCostoSpedizione(){
    return this.carrelloService.getCostoSpedizione()
  }

  getNumeroArticoli(): number{

    return this.carrello.reduce((totale, item) => totale + item.quantita, 0);

  }

  calcolaCostoSpedizione(): number{

    return parseFloat((Math.random() * (30 - 10) + 10).toFixed(0));

  }

  getPrezzoTotale(): string{

    return `${this.totaleConSpedizione.toFixed(2)}€`;

  }

  getTotaleSenzaSpedizione(): number{
    return this.carrello.reduce((totale, item) => totale + item.scarpa.prezzo * item.quantita, 0);
  }

  mostraPopup(): void{
    this.popupVisibile = true;
  }

  chiudiPopup(): void{
    this.popupVisibile = false;
  }

  mostraRitiro(): void{
    this.isRitiroVisible = true;
    this.isSpedizioneVisible = false;
    (document.querySelector("#ritiro") as HTMLElement).style.border = "1px solid black";
    (document.querySelector("#spedizione2") as HTMLElement).style.border = "1px solid rgba(0, 0, 0, 0.1)";
  }

  mostraSpedizione(): void{
    this.isSpedizioneVisible = true;
    this.isRitiroVisible = false;
    (document.querySelector("#ritiro") as HTMLElement).style.border = "1px solid rgba(0, 0, 0, 0.1)";
    (document.querySelector("#spedizione2") as HTMLElement).style.border = "1px solid black";
  }

  onFocus(input: string): void{

    if(input === 'nome') 
    {
      this.isFocusedNome = true;
    } 
    else if(input === 'cognome') 
    {
      this.isFocusedCognome = true;
    } 
    else if(input === 'indirizzo') 
    {
      this.isFocusedIndirizzo = true;
    }
    else if(input === 'ritiro')
    {
      this.isFocusedRitiro = true;
    }
    else if(input === 'Email')
    {
      this.isFocusedEmail = true;
    }
    else if(input === 'telefono')
    {
      this.isFocusedTelefono = true;
    }
    else if(input === 'numeroCarta') 
    {
      this.isFocusedNumeroCarta = true;
    }
    else if(input === 'dataCarta') 
    {
      this.isFocusedDataCarta = true;
    }
    else if(input === 'cvvCarta') 
    {
      this.isFocusedCvvCarta = true;
    }

  }
  
  onBlur(input: string): void{

    if(input === 'nome')
    {
      this.isTouchedNome = true;
      this.isFocusedNome = false;
      this.nomeValido = this.scrittaTop2.trim().length >= 2 && this.nomeRegex.test(this.scrittaTop2);
    }
    else if(input === 'cognome') 
    {
      this.isTouchedCognome = true;
      this.isFocusedCognome = false;
      this.cognomeValido = this.scrittaTop3.trim().length >= 2 && this.cognomeRegex.test(this.scrittaTop3);
    } 
    else if(input === 'indirizzo') 
    {
      this.isTouchedIndirizzo = true;
      this.isFocusedIndirizzo = false;
      this.indirizzoValido = this.scrittaTop4.trim().length >= 5 && this.indirizzoRegex.test(this.scrittaTop4);
    } 
    else if(input === 'Email') 
    {
      this.isTouchedEmail = true;
      this.isFocusedEmail = false;
      this.emailValido = this.scrittaTop5.trim().length > 0 && this.emailRegex.test(this.scrittaTop5);
    } 
    else if(input === 'telefono') 
    {
      this.isTouchedTelefono = true;
      this.isFocusedTelefono = false;
      this.telefonoValido = this.scrittaTop6.trim().length > 0 && this.telefonoRegex.test(this.scrittaTop6);
    }
    else if(input === 'ritiro') 
    {
      this.isFocusedRitiro = false;
    }
    else if (input === 'numeroCarta') 
    {
      this.isTouchedNumeroCarta = true;
      this.isFocusedNumeroCarta = false;
      this.numeroCartaValido = this.numeroCarta.trim().length >= 13 && this.numeroCartaRegex.test(this.numeroCarta);
    }
    else if (input === 'dataCarta') 
    {
      this.isTouchedDataCarta = true;
      this.isFocusedDataCarta = false;
      this.dataCartaValida = this.dataCartaRegex.test(this.dataCarta);
    }
    else if(input === 'cvvCarta') 
    {
      this.isTouchedCvvCarta = true;
      this.isFocusedCvvCarta = false;
      this.cvvCartaValido = this.cvvCartaRegex.test(this.cvvCarta);
    }

    this.formCompilato();

    this.controllaCampiCarta(); 

  }

  formCompilato(): void{

    this.isButtonActive = this.nomeValido && this.cognomeValido && this.indirizzoValido && this.emailValido && this.telefonoValido;
    
  }

  onSalvaEContinua(): void{

    if(this.isButtonActive) 
    {
      this.isFormCompilato = true; 
      this.isSpedizioneVisible = false;
      (document.querySelector("#titoloPagamento") as HTMLElement).style.color = "black"
    } 
    else 
    {
      this.isFormCompilato = false; 
      this.isSpedizioneVisible = true;
      (document.querySelector("#titoloPagamento") as HTMLElement).style.color = "rgba(0, 0, 0, 0.1)"
    }

  }

  modificaForm(): void{

    this.isFormCompilato = false; 

    this.isSpedizioneVisible = true; 

    (document.querySelector("#titoloPagamento") as HTMLElement).style.color = "rgba(0, 0, 0, 0.1)"
    
  }

  modificaPaese(){
    this.isPostoScelto = !this.isPostoScelto;
  }

  salvaPaese(){
    this.isPostoScelto = false; 
  }

  controllaCampiCarta(): void{
    this.isCartaButtonActive = this.numeroCartaValido && this.dataCartaValida && this.cvvCartaValido;
  }

  confermaMetodo(metodo: string): void{

    this.immagineMetodoFinale = metodo === 'Carta di credito' ? 'img/credit-card.png' : metodo === 'PayPal' ? 'img/paypal2.png': 'img/google-pay.png'; 

    this.mostraSoloMetodoScelto = true;

  }

  modificaMetodo(): void{
    this.mostraSoloMetodoScelto = false; 
    this.mostraVerificaOrdine = false;; 
    (document.querySelector("#titoloVerifica") as HTMLElement).style.color = "rgba(0, 0, 0, 0.1)"
  }

  mostraVerificaSezione(): void{
    this.mostraVerificaOrdine = true; 
    (document.querySelector("#titoloVerifica") as HTMLElement).style.color = "black"
  }

  effettuaPagamento(): void{
    this.completaOrdine();
    this.router.navigate(['/ringraziamenti']);
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

  completaOrdine(): void{

    if (this.carrello.length > 0){
      
      const totaleOrdine = this.carrello.reduce(
        (totale, item) => totale + item.scarpa.prezzo * item.quantita,
        0
      );
  
      this.carrello.forEach((item) => {

        const ordine = {
          prodotto: item.scarpa.nome,
          taglia: item.taglia,
          colore: item.colore,
          immagine: (Array.isArray(item.scarpa.immagini) && item.scarpa.immagini.length > 0) 
            ? item.scarpa.immagini[0].url 
            : 'immagineDefault.png',  
          data: new Date(),
          prezzoTotale: totaleOrdine 
        };
        

        this.orderService.aggiungiOrdine(ordine);

      });
      
  
      localStorage.setItem('totaleUltimoOrdine', totaleOrdine.toString());

      this.router.navigate(['/ringraziamenti']);

    } 
    else 
    {
      console.log('Il carrello è vuoto.');
    }

  }
  
}
