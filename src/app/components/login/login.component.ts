import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  isSignUpFailed = false;
  showPassword = false; 

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm): void {
    if (form.valid) {
      const { email, password } = this.form;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          if (res?.statusCode === 1 && res?.userId) {
            this.authService.saveUserId(res.name, res.userId);
            console.log(res.userId);
            console.log(res.name);
            console.log('Login successful');
            this.router.navigate(['/dashboard']);
          } else {
            this.showError(res?.errorMessage || 'Login failed.');
          }
        },
        error: (err) => {
  if (err.status === 400 && err.error?.errors) {
    const errors = Object.values(err.error.errors).flat().join('\n');
    this.showError(errors);
  } else {
    this.showError('Login failed. Please check your credentials or try again.');
  }
}

      });
    } else {
      this.showError('Please enter valid email and password.');
    }
  }

  resetLoginError(): void {
    this.isLoginFailed = false;
    this.errorMessage = '';
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.isLoginFailed = true;
  }
}


