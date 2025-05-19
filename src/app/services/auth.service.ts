import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const USER_ID_KEY = 'userId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5085/api/User';

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<any> {
    const payload = {
      Email:email,Password: password
    };
    console.log(payload);
    return this.http.post<any>(`${this.apiUrl}/userlogin`, payload);
    
  }

  // Signup
  signup(email: string, password: string): Observable<any> {
    const payload = {
      email,password
    };
    return this.http.post<any>(`${this.apiUrl}/userregister`, payload);
  }

  saveUserId(userId: number): void {
    localStorage.setItem(USER_ID_KEY, userId.toString());
  }

  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  logout(): void {
    localStorage.removeItem(USER_ID_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUserId();
  }
}




// import { Injectable } from '@angular/core';
// import { Observable} from 'rxjs';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// const TOKEN_KEY = 'token';
// const USER_ID_KEY = 'userId';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:5085/api/User';
//   constructor(private http: HttpClient) {}

//   // MOCK login - simulate a success response
//   login(email: string, password: string): Observable<any> {
//     const payload = {
//       email: email, // matches UserModel.Username
//       password: password
//     };
//     return this.http.post<any>(`${this.apiUrl}/userlogin`, payload);
//   } 

//   // Signup
//   signup(email: string, password: string): Observable<any> 
//   {
//     const payload = {
//       email: email, // matches UserModel.Username
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
  

// saveUserId(userId: string): void {
//   localStorage.setItem(USER_ID_KEY, userId);
// }

// getUserId(): string | null {
//   return localStorage.getItem(USER_ID_KEY);
// }

// }




 