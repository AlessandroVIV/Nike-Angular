import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TuttiProdottiComponent } from './tutti-prodotti/tutti-prodotti.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DettaglioScarpaComponent } from './dettaglio/dettaglio.component';
import { CarrelloComponent } from './carrello/carrello.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { RingraziamentiComponent } from './ringraziamenti/ringraziamenti.component';
import { RegisterComponent } from './registrazione/registrazione.component'; 
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AreaRiservataComponent } from './area-riservata/area-riservata.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';


registerLocaleData(localeIt);

@NgModule({

  declarations: [
    AppComponent,
    HomepageComponent,
    TuttiProdottiComponent,
    NotFoundComponent,
    DettaglioScarpaComponent,
    CarrelloComponent,
    PagamentoComponent,
    RingraziamentiComponent,
    RegisterComponent, 
    LoginComponent, AreaRiservataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule,
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  bootstrap: [AppComponent],
  
})

export class AppModule { }
