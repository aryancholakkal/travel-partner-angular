import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent {
  constructor(
      private ticketService: TicketService,
      private router : Router,
      private fb: FormBuilder
    ) {
      this.newTicketForm = this.fb.group({
        from_location: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        to_location: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        purpose_of_travel: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        is_lodging_required: ['', Validators.required],
        additional_note_employee: ['', Validators.pattern('^[a-zA-Z0-9 ]*$')]
      });
    }

  newTicketForm : FormGroup;  
  
  public managerDisplayName = this.ticketService.managerDisplayName  

  ticketStatus =''
  newTicket() {
    const ticketData = this.newTicketForm.value;
    this.ticketService.ticketButton(ticketData).subscribe({
        next: (response: any) => {
          this.ticketStatus = response.status;
          alert(this.ticketStatus);
          this.router.navigate(['employee/dashboard'])
        }
      }
    );

  }
}
