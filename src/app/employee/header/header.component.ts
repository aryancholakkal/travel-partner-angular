import { Component } from '@angular/core';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
      private ticketService: TicketService,
      private router: Router
  ){}

  logout(){
    this.ticketService.logout().subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token'); 
          this.router.navigate(['employee/login']);
        },
        error: (error) => {
          console.error('Logout failed:', error);
        }
    });
  }
}
