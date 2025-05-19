import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OcrService {
  private baseUrl = 'https://localhost:5085/api/FileUpload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('UserId', userId.toString()); // 🔥 Make sure this matches backend parameter

    return this.http.post(`${this.baseUrl}/upload-image`, formData);
  }


  // uploadImage(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return this.http.post(`${this.baseUrl}/upload-image`, formData);
  // }

  getExtractedText(): Observable<{ extractedText: string }> {
    return this.http.get<{ extractedText: string }>(`${this.baseUrl}/get-extracted-text`);
  }

  downloadDocx(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-docx`, { responseType: 'blob' });
  }

  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-pdf`, { responseType: 'blob' });
  }
}