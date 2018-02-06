import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductsService {

  baseUrl = 'http://localhost:3333/api';
  // baseUrl = 'https://bellino-pos.herokuapp.com/api';
  headers;
  constructor(private http: HttpClient) {
    // TODO: See if possible to put baseUrl and headers setup in a file to be reused everywhere
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }
  getProductsList() {
    return this.http.get(`${this.baseUrl}/products/all`, {
      withCredentials: true,
    });
  }


}