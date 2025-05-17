import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Import the AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoginFailed = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm): void {
    if (form.valid) {
      const { email, password } = this.form;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Invalid credentials.';
            this.isLoginFailed = true;
          }
        },
        error: () => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.isLoginFailed = true;
        }
      });
    } else {
      this.errorMessage = 'Please enter valid email and password.';
      this.isLoginFailed = true;
    }
  }
}