import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './manager.component';
import { LoginComponent } from './login/login.component';
import { DashboardManComponent } from './dashboard-man/dashboard-man.component';

const routes: Routes = [
  { path: '', component: ManagerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardManComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
