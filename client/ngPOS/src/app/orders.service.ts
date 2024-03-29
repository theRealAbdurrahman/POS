import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class OrdersService {

  headers;
  constructor(private http: HttpClient) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true' });
  }

  // TODO: See if possible to put baseUrl and headers setup in a file to be reused everywhere
  baseUrl = environment.apiUrl;

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
    return this.http.get(`${this.baseUrl}/orders/${id}`, {
      withCredentials: true,
    });
  }
  addOrder(order) {
    return this.http.post(`${this.baseUrl}/orders`, order, {
      withCredentials: true,
    });
  }
  deleteOrder(id) {
    return this.http.delete(`${this.baseUrl}/orders/${id}`, {
      withCredentials: true,
    });
  }
}
