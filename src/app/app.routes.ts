import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { OcrUploaderComponent } from './components/ocr/ocr.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'ocr', component: OcrUploaderComponent },
  { path: '**', redirectTo: '' } // wildcard to redirect unknown routes
];

export const AppRoutes = provideRouter(routes);
