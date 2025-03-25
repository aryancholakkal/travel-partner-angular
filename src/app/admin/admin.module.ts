import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNewComponent } from './add-new/add-new.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    AddNewComponent,
    AdminDashboardComponent,
    AdminViewComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }



