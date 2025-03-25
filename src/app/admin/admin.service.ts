import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8000/admin'; // Define this in your environment file

  constructor(private http: HttpClient) { }

  // Set HTTP headers with auth token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
  }

  private obj!: Observable<any>;
  loginAdmin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  } 

  getTicketDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/`, { headers: this.getHeaders() });
  }

  filterTickets(data: any): Observable<any> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: data }),
    };
    return this.http.get(`${this.baseUrl}/filter/`, options);
  }

  requestEditTicket(id: number, feedback: any) {
    return this.http.put(
      `http://localhost:8000/admin/request_edit/${id}/`,
      { feedback: feedback },
      { headers: this.getHeaders() }
    );
  }

  // Close a ticket
  closeTicket(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/close-ticket/`, data, { headers: this.getHeaders() });
  }

  // Submit feedback
  submitFeedback(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/feedback`, data, { headers: this.getHeaders() });
  }

 

  // New methods for managing employees and managers
  
  // Get all managers
  loadManagers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/manage-manager/`, { headers: this.getHeaders() });
  }
  
  // Create a new manager
  createManager(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/manage-manager/`, data, { headers: this.getHeaders() });
  }
  
  loadEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/manage-employee/`, { headers: this.getHeaders() });
  }
  
  // Create a new employee
  createEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/manage-employee/`, data, { headers: this.getHeaders() });
  }

   logout(): Observable<any> {
    return this.http.post(`http://localhost:8000/travel_app/logout/`, {}, { headers: this.getHeaders() });
  }

}