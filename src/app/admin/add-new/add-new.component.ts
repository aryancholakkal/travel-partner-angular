import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent implements OnInit {
  addNewForm: FormGroup;
  employeeType: 'Employee' | 'Manager' = 'Manager';
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private adminService: AdminService,
  ) {
    // Initialize form with common fields
    this.addNewForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]] // Added password field
    });
    
    // Add manager_id control if initial type is Employee
    if (this.employeeType === 'Employee') {
      this.addNewForm.addControl('manager_id', this.fb.control('', Validators.required));
    }
  }
  
  ngOnInit(): void {
    // Any initialization logic
  }
  
  onEmployeeTypeChange(type: 'Employee' | 'Manager'): void {
    this.employeeType = type;
    
    // Dynamically add/remove manager_id control
    if (type === 'Employee') {
      this.addNewForm.addControl('manager_id', this.fb.control('', Validators.required));
    } else {
      this.addNewForm.removeControl('manager_id');
    }
  }
  
  onSubmit(): void {
    if (this.addNewForm.valid) {
      this.isSubmitting = true;
      const formData = this.addNewForm.value;
      
      if (this.employeeType === 'Employee') {
        this.adminService.createEmployee(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding employee:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        this.adminService.createManager(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding manager:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.addNewForm);
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}