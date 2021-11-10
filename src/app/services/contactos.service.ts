import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contacto } from '../models/contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  resourceUrl = 'https://pymes2021.azurewebsites.net/api/contactos';
  constructor(private httpClient: HttpClient) {}

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + '/' + Id);
  }

  post(obj: Contacto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  /*  put(Id: number, obj: Contacto) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }
*/
}
