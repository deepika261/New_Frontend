import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';
  isSignUpFailed = false;
  showPassword = false;  // For toggle password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
      ]]
    });
  }

  resetSignUpError(): void {
    this.isSignUpFailed = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      console.log("Sending:", { name, email, password });
      this.authService.signup(name, email, password).subscribe({
        next: (res) => {
          console.log('Signup successful: ',res);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Signup erreor: ',error);
          // if (error.status === 409 || (error.error && error.error.includes('already exists'))) {
          //   this.errorMessage = 'Email already exists. Please use a different email.';
          // } else {
          //   this.errorMessage = 'Signup failed. Please try again.';
          // }
          this.errorMessage = 'Signup failed. Please try again.';
          this.isSignUpFailed = true;
        }
      });
      console.log('Signup submitted');
    } else {
      this.errorMessage = 'Please enter valid email and password.';
      this.isSignUpFailed = true;
    }
  }
}

