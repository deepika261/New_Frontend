import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';  // <-- Add this import for ngModel binding
import { AppComponent } from './app/app.component'; // Assuming you have this component as root

import { routes } from './app/app.routes';  // Import your route config

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule) // <-- Ensure FormsModule is imported for ngModel binding
  ]
})
  .catch(err => console.error(err));
