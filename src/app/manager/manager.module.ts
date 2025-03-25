import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardManComponent } from './dashboard-man/dashboard-man.component';

@NgModule({
  declarations: [
    ManagerComponent,
    LoginComponent,
    DashboardManComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DashboardManComponent
  ]
})
export class ManagerModule { }
