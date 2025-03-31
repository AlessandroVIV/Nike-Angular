import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TuttiProdottiComponent } from './tutti-prodotti/tutti-prodotti.component';
import { DettaglioScarpaComponent } from './dettaglio/dettaglio.component';
import { CarrelloComponent } from './carrello/carrello.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { RingraziamentiComponent } from './ringraziamenti/ringraziamenti.component';
import { RegisterComponent } from './registrazione/registrazione.component';
import { LoginComponent } from './login/login.component';
import { AreaRiservataComponent } from './area-riservata/area-riservata.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';

const routes: Routes = [

  { path: '', component: HomepageComponent }, 
  { path: 'prodotti', component: TuttiProdottiComponent }, 
  { path: 'prodotti/:id', component: DettaglioScarpaComponent }, 
  { path: 'carrello', component: CarrelloComponent},
  { path: 'pagamento', component: PagamentoComponent},
  { path: 'ringraziamenti', component: RingraziamentiComponent},
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
  { path: 'area-riservata', component: AreaRiservataComponent, canActivate: [AuthGuard]},
  { path: '**', component: NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
