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
      const { email, password } = this.signupForm.value;
      this.authService.signup(email, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
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





// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css']
// })
// export class SignupComponent {
//   signupForm: FormGroup;
//   errorMessage = '';
//   isSignUpFailed = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.signupForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [
//         Validators.required,
//         Validators.minLength(6),
//         Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
//       ]]
//     });
//   }

//   onSubmit(): void {
//     if (this.signupForm.valid) {
//       const { email, password } = this.signupForm.value;
//       this.authService.signup(email, password).subscribe({
//         next: () => {
//           this.router.navigate(['/login']);
//         },
//         error: () => {
//           this.errorMessage = 'Signup failed. Please try again.';
//           this.isSignUpFailed = true;
//         }
//       });
//       console.log('Signup submitted');
//     } else {
//       this.errorMessage = 'Please enter valid email and password.';
//       this.isSignUpFailed = true;
//     }
//   }
// }
