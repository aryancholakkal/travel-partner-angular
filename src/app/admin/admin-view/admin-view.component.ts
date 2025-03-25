import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  employees: any[] = [];
  managers: any[] = [];
  
  currentPageManagers = 0;
  currentPageEmployees = 0;
  pageSize = 4;

  constructor(
    private http: HttpClient,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.adminService.loadEmployees().subscribe({
      next: (response: any) => {
        this.employees = response;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });

    this.adminService.loadManagers().subscribe({
      next: (response: any) => {
        this.managers = response;
      },
      error: (err) => {
        console.error('Error fetching managers:', err);
      }
    });
  }

  get paginatedManagers() {
    const start = this.currentPageManagers * this.pageSize;
    return this.managers.slice(start, start + this.pageSize);
  }

  get paginatedEmployees() {
    const start = this.currentPageEmployees * this.pageSize;
    return this.employees.slice(start, start + this.pageSize);
  }

  nextManagersPage() {
    if ((this.currentPageManagers + 1) * this.pageSize < this.managers.length) {
      this.currentPageManagers++;
    }
  }

  prevManagersPage() {
    if (this.currentPageManagers > 0) {
      this.currentPageManagers--;
    }
  }

  nextEmployeesPage() {
    if ((this.currentPageEmployees + 1) * this.pageSize < this.employees.length) {
      this.currentPageEmployees++;
    }
  }

  prevEmployeesPage() {
    if (this.currentPageEmployees > 0) {
      this.currentPageEmployees--;
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
