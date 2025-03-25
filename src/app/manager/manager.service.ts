import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8000/manager';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  private obj!: Observable<any>;
  loginManager(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }
  getTicketDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/`, {
      headers: this.getHeaders(),
    });
  }
  approveTicket(id: number, feedback: any) {
    if (!feedback) {
      console.warn('Feedback is null or undefined:', feedback);
    } else {
      console.log('Feedback value:', feedback);
    }
    return this.http.put(
      `${this.baseUrl}/approve-ticket/${id}/`,
      { feedback: feedback }, 
      { headers: this.getHeaders() }
    );
  }
  rejectManager(id: number, feedback: any) {
    return this.http.put(
      `${this.baseUrl}/reject-ticket/${id}/`,
      { feedback: feedback },
      { headers: this.getHeaders() }
    );
  }

  filterButton(data: any): Observable<any> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: data }),
    };
    return this.http.get(`${this.baseUrl}/filter/`, options);
  }
  
  requestEditManager(id: number, feedback: any) {
    return this.http.put(
      `http://localhost:8000/travel_app/request_edit/${id}/`,
      { feedback: feedback },
      { headers: this.getHeaders() }
    );
  }

  submitFeedback(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/feedback/`, data, {
      headers: this.getHeaders(),
    });
  }
  logout(){
    return this.http.post(`http://localhost:8000/travel_app/logout/`, {},{ headers: this.getHeaders()});
  }
}
