import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginpage(): void {
  // Navigate to history page (example path: '/history')
  window.location.href = '/login'; // or use Angular Router: this.router.navigate(['/history']);
}
signuppage(): void {
  // Navigate to history page (example path: '/history')
  window.location.href = '/register'; // or use Angular Router: this.router.navigate(['/history']);
}
}
