import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewComponent } from './add-new/add-new.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'add-new', component: AddNewComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'login', component: LoginComponent},
  { path: 'employee-listing', component: AdminViewComponent },
  { path: '', redirectTo: 'requests', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }