import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    EmployeeComponent,
    HeaderComponent,
    DashboardComponent,
    NewTicketComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    LoginComponent 
  ]
})
export class EmployeeModule { }
