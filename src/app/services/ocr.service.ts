import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OcrService {
  private baseUrl = 'https://localhost:44312/api/FileUpload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload-image`, formData);
  }

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
