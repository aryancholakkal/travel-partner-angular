import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Ensure only valid paths are included
})
export class LoginComponent {
  constructor(
    private router : Router,
    private managerService : ManagerService
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
      this.managerService.loginManager(loginData).subscribe({
        next: (response: any) => {
          if(response.status === "success"){            
            this.loginError = false;
            localStorage.setItem('token', response.token);
            this.router.navigate(['manager/dashboard']) 
          }
          else{
            this.loginError = true;
            alert("Login Failed!")
          }
        },
        error: () => {
          this.loginError = true;
          alert("Login Failed!")
        }
      })
    } else {
      this.loginError = true;
    }    
  }
  toEmployee(){
    this.router.navigate(['employee/login'])
  }
  toAdmin(){
    this.router.navigate(['admin/login'])
  }
}
