import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IScarpa } from '../models/IScarpa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ScarpeService {

  constructor(private http: HttpClient){}

  apiLista: string = "http://localhost:8080/prodotti";

  getProdotti():Observable<IScarpa[]>{
    return this.http.get<IScarpa[]>(this.apiLista);
  }

  getDetailById(id: number): Observable<IScarpa>{
    return this.http.get<IScarpa>(`${this.apiLista}/${id}`);
  }

}
