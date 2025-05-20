import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService} from './auth.service';
@Injectable({ providedIn: 'root' })
export class OcrService {
  private baseUrl = 'http://localhost:5085/api/File';

  constructor(private http: HttpClient ,private authService: AuthService) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    
    const userId = this.authService.getUserId();
    if (userId !== null) {
      formData.append('UserId', userId.toString());
    } else {
      console.error('UserId is missing!');
      return new Observable(observer => {
        observer.error('UserId is missing!');
      });
    }
    formData.append('file', file);
 //  Make sure this matches backend parameter
    console.log('Sending form data with:', {
    file: file.name,
    userId: userId
  });
    return this.http.post(`${this.baseUrl}/upload-image`, formData);
  }


  // uploadImage(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return this.http.post(`${this.baseUrl}/upload-image`, formData);
  // }

  // getExtractedText(): Observable<{ extractedText: string }> {
  //   return this.http.get<{ extractedText: string }>(`${this.baseUrl}/get-extracted-text`,formData);
  // }
  getExtractedText(): Observable<{ extractedText: string }> {
    const userId = this.authService.getUserId();
    if (userId === null) {
      console.error('UserId is missing!');
      return new Observable(observer => {
        observer.error('UserId is missing!');
      });
    }
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<{ extractedText: string }>(`${this.baseUrl}/get-extracted-text`, { params });
  }

  // downloadDocx(): Observable<Blob> {
  //   return this.http.get(`${this.baseUrl}/download-docx`, { responseType: 'blob' });
  // }

  downloadDocx(): Observable<Blob> {
    const userId = this.authService.getUserId();
    if (userId === null) {
      console.error('UserId is missing!');
      return new Observable(observer => {
        observer.error('UserId is missing!');
      });
    }

    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.baseUrl}/download-docx`, { responseType: 'blob', params });
  }

  // downloadPdf(): Observable<Blob> {
  //   return this.http.get(`${this.baseUrl}/download-pdf`, { responseType: 'blob' });
  // }

  downloadPdf(): Observable<Blob> {
    const userId = this.authService.getUserId();
    if (userId === null) {
      console.error('UserId is missing!');
      return new Observable(observer => {
        observer.error('UserId is missing!');
      });
    }

    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.baseUrl}/download-pdf`, { responseType: 'blob', params });
  }

}