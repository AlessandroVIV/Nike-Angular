import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly BASE_URL = 'http://localhost:8080/ordini';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrdiniUtente(): Observable<any[]> {
    const utenteId = this.authService.getUtenteId();
    const secretKey = this.authService.getSecretKey();

    const headers = new HttpHeaders({
      'Secret-Key': secretKey!
    });

    return this.http.get<any[]>(`${this.BASE_URL}/${utenteId}`, { headers });
    
  }

}
