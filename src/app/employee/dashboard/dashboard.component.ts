import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  details!: any[]; // Replace 'any' with a proper type if available
  filterForm!: FormGroup;

  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder,
    private router : Router
  ) {}

  ngOnInit() {
    this.fetchTickets();

    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      place: [''],
      status: ['']
    });
  }

  fetchTickets() {
    this.ticketService.getTicketDetails().subscribe({
      next: (response: any) => {
        this.details = response;
        console.log(this.details);
      }
    });
  }

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
      }
    });
    this.closeModal()
  }

  ticket_id  = 0
  current_ticket: any = {}
  showModal!: boolean // Use primitive 'boolean'
  
  editTicketForm : FormGroup = new FormGroup({
    from_location: new FormControl(''),
    to_location: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    purpose_of_travel: new FormControl(''),
    is_lodging_required: new FormControl(''), 
    additional_request: new FormControl(''),
    modeOfTravel:new FormControl('')
  }); 

  editModal(id:number){
    this.ticket_id = id;
    this.current_ticket = this.details.find(req => req.id === this.ticket_id)
    if (!this.current_ticket) {
          alert("Ticket not found!"); 
          return;
      }  
      if (['Rejected', 'Approved'].includes(this.current_ticket.manager_ticket_status))     {
          alert("Editing is only allowed for 'Reqeuest edit or Not Responded' requests.");
          return;
      }  
      this.showModal = true; 
      this.editTicketForm.patchValue(this.current_ticket)       
  }
  closeModal() {
    this.showModal = false;  
  }
  saveEdit(){
    console.log(this.editTicketForm.value)
    this.ticketService.saveEdit(this.ticket_id, this.editTicketForm.value).subscribe({
      next: (response:any) => {
        console.log(response)
      }
    })
    this.closeModal()
  }

  selectedTicketId !:number // Use primitive 'number'
  deleteTicket(){
    this.ticketService.deleteTicket(this.selectedTicketId).subscribe({
      next: (response:any)=>{
        console.log(response)
        alert(response.status)
        window.location.reload()
      }
    })
  }
}

