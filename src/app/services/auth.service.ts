import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const USER_ID_KEY = 'userId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5085/api/User';
  userId: number=0;
  name:string='';
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
  signup(name:string, email: string, password: string): Observable<any> {
    const payload = {
      name, email,password
    };
    return this.http.post<any>(`${this.apiUrl}/userregister`, payload);
  }

  saveUserId(name:string, userId: number): void {
    this.userId = userId;
    this.name=name;
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
     const storedId = localStorage.getItem('userId');
    return storedId ? parseInt(storedId, 10) : this.userId;
  }
  getUserName(){
    return this.name || localStorage.getItem('name');
  }

clearUser(): void {
    this.userId = -1;
    localStorage.removeItem('userId');
  }

  logout(): void {
    localStorage.removeItem(USER_ID_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUserId();
  }
}





 