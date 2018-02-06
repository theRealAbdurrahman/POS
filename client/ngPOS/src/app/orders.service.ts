import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrdersService {

  headers;
  constructor(private http: HttpClient) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true' });
  }

  // TODO: See if possible to put baseUrl and headers setup in a file to be reused everywhere
<<<<<<< HEAD
  // baseUrl = 'https://bellino-pos.herokuapp.com/api';
=======
>>>>>>> 35136bab473a40c44a4f3122dcfe3a83cb2f9267
  baseUrl = 'http://localhost:3333/api';

  list() {
    return this.http.get(this.baseUrl + '/orders', {
      withCredentials: true,
    });
  }
  getManfs() {
    return this.http.get(`${this.baseUrl}/manufacturers`, {
      withCredentials: true,
    });
  }
  getOrderDetails(id) {
    return this.http.get(`${this.baseUrl}/orders/${id}`);
  }
  addOrder(order) {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }
}