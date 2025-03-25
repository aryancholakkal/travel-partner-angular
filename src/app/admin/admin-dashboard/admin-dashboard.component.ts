import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  details: any[] = [];
  filteredDetails: any[] = [];
  paginatedDetails: any[] = []; // Added for template compatibility
  filterForm!: FormGroup;
  feedbackForm!: FormGroup;
  selectedSortOption = 'start_date'; 
  isAscending = true;
  searchText = '';
  
  // Pagination variables
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totalPages = 0;
  
  // For filter modal
  startDate = '';
  endDate = '';
  place = '';
  status = '';
  
  selectedTicketId = 0;
  ticketEdit: any = {};
  showModal = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTickets();

    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      place: [''],
      status: [''],
    });

    this.feedbackForm = this.fb.group({
      feedbackText: ['']
    });
  }

  fetchTickets() {
    this.adminService.getTicketDetails().subscribe({
      next: (response: any) => {
        this.details = response;
        this.filteredDetails = [...this.details];
        this.totalItems = this.details.length;
        this.calculateTotalPages();
        this.onSortOptionChange();
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
      }
    });
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedDetails = this.filteredDetails.slice(start, end);
  }

  onSortOptionChange(): void {
    this.filteredDetails.sort((a, b) => {
      let valueA, valueB;

      switch (this.selectedSortOption) {
        case 'name':
          valueA = a.employee_username?.toLowerCase() || '';
          valueB = b.employee_username?.toLowerCase() || '';
          break;
        case 'start_date':
          valueA = new Date(a.start_date || 0).getTime();
          valueB = new Date(b.start_date || 0).getTime();
          break;
        default:
          valueA = a.id || 0;
          valueB = b.id || 0;
      }

      if (valueA < valueB) return this.isAscending ? -1 : 1;
      if (valueA > valueB) return this.isAscending ? 1 : -1;
      return 0;
    });
    this.updatePaginatedData();
  }

  toggleSortDirection(): void {
    this.isAscending = !this.isAscending;
    this.onSortOptionChange();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  search(): void {
    if (!this.searchText.trim()) {
      this.filteredDetails = [...this.details];
    } else {
      const lowerCaseSearchTerm = this.searchText.toLowerCase();
      this.filteredDetails = this.details.filter(ticket =>
        ticket.employee_username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        (ticket.manager_name && ticket.manager_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        ticket.from_location?.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.to_location?.toLowerCase().includes(lowerCaseSearchTerm) ||
        (ticket.purpose_of_travel && ticket.purpose_of_travel.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    this.totalItems = this.filteredDetails.length;
    this.calculateTotalPages();
    this.currentPage = 1; // Reset to first page when searching
    this.updatePaginatedData();
  }

  applyFilters(): void {
    const formValues = this.filterForm.value;
    this.startDate = formValues.startDate;
    this.endDate = formValues.endDate;
    this.place = formValues.place;
    this.status = formValues.status;
    
    this.filteredDetails = this.details.filter(ticket => {
      let match = true;
      
      if (this.startDate && new Date(ticket.start_date) < new Date(this.startDate)) {
        match = false;
      }
      
      if (this.endDate && new Date(ticket.end_date) > new Date(this.endDate)) {
        match = false;
      }
      
      if (this.place && 
          !(ticket.from_location?.toLowerCase().includes(this.place.toLowerCase()) || 
            ticket.to_location?.toLowerCase().includes(this.place.toLowerCase()))) {
        match = false;
      }
      
      if (this.status && ticket.manager_ticket_status !== this.status) {
        match = false;
      }
      
      return match;
    });
    
    this.totalItems = this.filteredDetails.length;
    this.calculateTotalPages();
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePaginatedData();
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.place = '';
    this.status = '';
    this.filterForm.reset();
    this.filteredDetails = [...this.details];
    this.totalItems = this.filteredDetails.length;
    this.calculateTotalPages();
    this.currentPage = 1; // Reset to first page when clearing filters
    this.updatePaginatedData();
  }

  logout() {
    this.adminService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        localStorage.removeItem('token'); 
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }
  
  viewDetails(ticket: any): void {
    this.selectedTicketId = ticket.id;
    this.ticketEdit = this.details.find((req) => req.id === this.selectedTicketId);
    if (!this.ticketEdit) {
      alert('Ticket not found!');
      return;
    }
    this.showModal = true; 
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  closeTicket(): void {
    if (!this.selectedTicketId) return;
    
    const feedbackText = this.feedbackForm.value.feedbackText;
    
    this.adminService.closeTicket({ticket_id:this.selectedTicketId, feedback:feedbackText}).subscribe({
      next: (response) => {
        console.log('Ticket closed successfully:', response);
        this.feedbackForm.reset();
        this.fetchTickets(); // Refresh the ticket list
      },
      error: (error) => {
        console.error('Error closing ticket:', error);
      }
    });
  }
}