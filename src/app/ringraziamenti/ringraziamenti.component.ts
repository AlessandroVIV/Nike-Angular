import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ringraziamenti',
  templateUrl: './ringraziamenti.component.html',
  styleUrl: './ringraziamenti.component.css'
})

export class RingraziamentiComponent {
  
  constructor(private authService: AuthService){}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void{
    this.authService.logout();
  }

}
