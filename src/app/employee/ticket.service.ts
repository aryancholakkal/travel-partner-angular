import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'http://localhost:8000/employee';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  getTicketDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets`, { headers: this.getHeaders() });
  }

  filterButton(data: any): Observable<any> {
    let options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: data })
    };
    return this.http.get(`${this.baseUrl}/filter_dash`, options);
  }

  ticketButton(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/`, data, { headers: this.getHeaders() });
  }

  deleteTicket(id: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tickets/${id}/`,{ },{ headers: this.getHeaders() });
  }
  
  public managerDisplayName !: string 
  private obj !: Observable<any>
  loginEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data).pipe(
      tap((event: any) => {
          this.managerDisplayName = event.manager_username;
      }))
  }

  saveEdit(id:Number, data:any){
    return this.http.patch(`${this.baseUrl}/tickets/${id}/`,data,{ headers: this.getHeaders() });
  }

  logout(){
    return this.http.post(`http://localhost:8000/travel_app/logout/`, {},{ headers: this.getHeaders()});
  }
}
