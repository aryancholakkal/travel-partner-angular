import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManagerService } from '../manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-man',
  templateUrl: './dashboard-man.component.html',
  styleUrls: ['./dashboard-man.component.css'],
})
export class DashboardManComponent implements OnInit {
  details: any[] = [];
  filteredDetails = [...this.details]; 
  filterForm!: FormGroup;
  feedbackForm!: FormGroup;
  selectedSortOption = 'start_date';
  isAscending = true;

  constructor(
    private ticketService: ManagerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
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

    this.onSortOptionChange();
  }

  fetchTickets() {
    this.ticketService.getTicketDetails().subscribe({
      next: (response: any) => {
        this.details = response;
        this.filteredDetails = [...this.details]; // Show all tickets by default
        console.log(this.details);
      },
    });
  }
 
  selectedTicketId = 0;

  onFilterClick() {
    const filterData = this.filterForm.value;
    this.ticketService.filterButton(filterData).subscribe({
      next: (response: any) => {
        console.log(filterData);
        this.details = response;
        console.log(this.details);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  filterByEmployeeName(searchTerm: string): void {
    if (!searchTerm.trim()) {
        this.filteredDetails = [...this.details]; 
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredDetails = this.details.filter(ticket =>
        ticket.employee_username.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterByEmployeeName(inputElement.value);
  }

  onSortClick(): void {
    this.isAscending = !this.isAscending;
    this.filteredDetails.sort((a, b) => {
      const nameA = a.employee_username.toLowerCase();
      const nameB = b.employee_username.toLowerCase();
      if (nameA < nameB) return this.isAscending ? -1 : 1;
      if (nameA > nameB) return this.isAscending ? 1 : -1;
      return 0;
    });
  }

  onApplySortClick(): void {
    this.isAscending = !this.isAscending;
    this.filteredDetails.sort((a, b) => {
      let valueA, valueB;

      if (this.selectedSortOption === 'name') {
        valueA = a.employee_username.toLowerCase();
        valueB = b.employee_username.toLowerCase();
      } else if (this.selectedSortOption === 'start_date') {
        valueA = new Date(a.start_date).getTime();
        valueB = new Date(b.start_date).getTime();
      }

      if (valueA < valueB) return this.isAscending ? -1 : 1;
      if (valueA > valueB) return this.isAscending ? 1 : -1;
      return 0;
    });
  }

  onSortOptionChange(): void {
    this.filteredDetails.sort((a, b) => {
      let valueA, valueB;

      if (this.selectedSortOption === 'name') {
        valueA = a.employee_username.toLowerCase();
        valueB = b.employee_username.toLowerCase();
      } else if (this.selectedSortOption === 'start_date') {
        valueA = new Date(a.start_date).getTime();
        valueB = new Date(b.start_date).getTime();
      }

      if (valueA < valueB) return this.isAscending ? -1 : 1;
      if (valueA > valueB) return this.isAscending ? 1 : -1;
      return 0;
    });
  }

  approveManager() {
    console.log(this.selectedTicketId);
    this.ticketService.approveTicket(this.selectedTicketId, { feedback: this.feedbackForm.value.feedbackText }).subscribe({
      next: (response: any) => {
        console.log(response);
        alert(response.status);
        window.location.reload();
      },
    });
  }
  rejectManager() {
    console.log(this.selectedTicketId);
    // this.feedbackSubmit()
    this.ticketService.rejectManager(this.selectedTicketId, { feedback: this.feedbackForm.value.feedbackText }).subscribe({
      next: (response: any) => {
        console.log(response);
        alert(response.status);
        window.location.reload();
      },
    });
  }
  requestEditManager() {
    this.ticketService.requestEditManager(this.selectedTicketId, { feedback: this.feedbackForm.value.feedbackText }).subscribe({
      next: (response: any) => {
        console.log(response);
        alert(response.status);
      },
    });
  }
  ticket_id = 0;
  ticketEdit: any = {};
  showModal = false;

  feedback(id: number) {
    this.ticket_id = id;
    this.ticketEdit = this.details.find((req) => req.id === this.ticket_id);
    if (!this.ticketEdit) {
      alert('Ticket not found!');
      return;
    }
  }
  feedbackSubmit() {
    if (!this.feedbackForm.valid) {
      alert('Please fill out the feedback form correctly.');
      return;
    }

    const feedbackData = {
      ticket_id: this.ticket_id,
      ...this.feedbackForm.value,
    };

    this.ticketService.submitFeedback(feedbackData).subscribe({
      next: (response: any) => {
        console.log(response);
        alert('Feedback submitted successfully!');
        this.showModal = false;
        window.location.reload();
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert('Failed to submit feedback. Please try again.');
      },
    });
  }
  logout(){
    this.ticketService.logout().subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token'); 
          this.router.navigate(['manager/login']);
        },
        error: (error) => {
          console.error('Logout failed:', error);
        }
    });
  }
  toggleSortDirection(): void {
    this.isAscending = !this.isAscending;
    this.onSortOptionChange();
  }
}