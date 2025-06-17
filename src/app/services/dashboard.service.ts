import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService} from './auth.service';
import jsPDF from 'jspdf';
export interface FileItem {
  id: number;
  name: string;
}

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
  uploadImages(files: File[]): Observable<any> {
  const formData = new FormData();
  const userId = this.authService.getUserId();

  if (userId === null) {
    return new Observable(observer => observer.error('UserId is missing!'));
  }

  formData.append('UserId', userId.toString());

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);  // Append multiple files with same key
  }

  console.log('Sending multiple images:', files.length);

  return this.http.post(`${this.baseUrl}/upload-images1`, formData);
}


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
   downloadExtractedText(text: string, type: 'pdf' | 'docx'): void {
    const fileName = 'Download';

    if (type === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, 10);
      doc.save(`${fileName}.pdf`);
    } else {
      const blob = new Blob([text], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
}