import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Ensure only valid paths are included
})
export class LoginComponent {
  constructor(
    private router : Router,
    private adminService : AdminService
  ){
  }
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loginError: boolean = false;
  login() {
    const loginData = this.loginForm.value;
    if (this.loginForm.valid) {
      this.adminService.loginAdmin(loginData).subscribe({
        next: (response: any) => {
          if(response.status === "success"){            
            localStorage.setItem('token', response.token);
            this.router.navigate(['admin/dashboard'])
          }
          else{
            this.loginError = true;
            alert("Login Failed!")
          }
        }
      })
    }    
  }
  
  toEmployee(){
    this.router.navigate(['employee/login'])
  }
  toManager(){
    this.router.navigate(['manager/login'])
  }
}
