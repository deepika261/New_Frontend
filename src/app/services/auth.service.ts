// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// const TOKEN_KEY = 'token';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'https://localhost:7001/api/user';
//   constructor(private http: HttpClient) {}

//   // MOCK login - simulate a success response
//   login(email: string, password: string): Observable<any> {
//     const payload = {
//       username: email, // matches UserModel.Username
//       password: password
//     };
//     return this.http.post<any>(`${this.apiUrl}/userlogin`, payload);
//   }

//   // Signup
//   signup(email: string, password: string): Observable<any> {
//     const payload = {
//       username: email, // matches UserModel.Username
//       password: password
//     };
//     return this.http.post<any>(`${this.apiUrl}/userregister`, payload);
//   }

//   saveToken(token: string): void {
//     localStorage.setItem(TOKEN_KEY, token);
//   }

//   getToken(): string | null {
//     return localStorage.getItem(TOKEN_KEY);
//   }

//   logout(): void {
//     localStorage.removeItem(TOKEN_KEY);
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }
// }








// login(email: string, password: string): Observable<any> {
//   return new Observable(observer => {
//     if (email === 'test@example.com' && password === 'password123') {
//       observer.next({ token: 'mock-token-123' });
//     } else {
//       observer.error({ error: { message: 'Invalid login' } });
//     }
//     observer.complete();
//   });
// }

// signup(email: string, password: string): Observable<any> {
//   return new Observable(observer => {
//     observer.next({ message: 'Signup success' });
//     observer.complete();
//   });
// }

/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://your-api-url.com/api';  // Replace with actual API

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  // Signup method
  signup(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { email, password });
  }

  
  
}*/



import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const TOKEN_KEY = 'token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7001/api/user';
  constructor(private http: HttpClient) {}

  // MOCK login - simulate a success response
  login(email: string, password: string): Observable<any> {
    const payload = {
      username: email, // matches UserModel.Username
      password: password
    };
    return this.http.post<any>(`${this.apiUrl}/userlogin`, payload);
  }

  // Signup
  signup(email: string, password: string): Observable<any> {
    const payload = {
      username: email, // matches UserModel.Username
      password: password
    };
    return this.http.post<any>(`${this.apiUrl}/userregister`, payload);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}




