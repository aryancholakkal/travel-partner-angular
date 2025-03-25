import { Component, Input } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() activePage: 'requests' | 'add-new' | 'employee-listing' = 'requests';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  logout(){
    this.adminService.logout().subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token'); 
          this.router.navigate(['admin/login']);
        },
        error: (error) => {
          console.error('Logout failed:', error);
        }
    });
  }
}
