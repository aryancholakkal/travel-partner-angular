import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Ensure only valid paths are included
})
export class LoginComponent {
  constructor(
    private ticketService: TicketService,
    private router : Router
  ){
    
  }
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loginError = false;
  login() {
    const loginData = this.loginForm.value;
    if (this.loginForm.valid) {
      this.ticketService.loginEmployee(loginData).subscribe({
        next: (response: any) => {
          if(response.status === "success"){            
            localStorage.setItem('token', response.token);
            this.router.navigate(['employee/dashboard'])
          }
          else{
            this.loginError = true;
            alert("Login Failed!")
          }
        }
      })
    }    
  }
  toManager(){
    this.router.navigate(['manager/login'])
  }
  toAdmin(){
    this.router.navigate(['admin/login'])
  }
}
