import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { jsPDF } from 'jspdf';
export interface FileItem {
  id: number;
  fileName: string;
  filePath: string;
  extractedText?: string;
  uploadedDate: string;
  imageUrl?: string; // computed on the frontend
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl = 'http://localhost:5085/api/History';

  constructor(private http: HttpClient,private authService: AuthService) {}

  /**
   * Get the last 10 uploaded files for a specific user by email.
   */
  getLast10Files(): Observable<FileItem[]> {
    const formData = new FormData();
    
    const userId = this.authService.getUserId();
    console.log('User ID in getLast10Files:', userId);

    if (userId !== null) {
      formData.append('UserId', userId.toString());
    } else {
      console.error('UserId is missing!');
      return new Observable(observer => {
        observer.error('UserId is missing!');
      });
    }
    console.log('Sending form data with:', {
    userId: userId
  });
                           
  return this.http.get<FileItem[]>(`${this.baseUrl}/get_history/${userId}`);
  }

  /**
   * Fetch the extracted text from a given file ID.
   */
  getExtractedText(fileId: number): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(`${this.baseUrl}/text/${fileId}`);
  }

  /**
   * Download extracted text as either PDF or DOCX file.
   */
  downloadText(fileName: string, text: string, type: 'pdf' | 'docx'): void {
    const blob = new Blob([text], {
      type: type === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Download.${type}`;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
  

downloadText1(fileName: string, text: string, type: 'pdf' | 'docx'): void {
  if (type === 'pdf') {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180); // wrap text
    doc.text(lines, 10, 10);
    doc.save(`${fileName}.pdf`);
  } else {
    // DOCX fallback (plain text as workaround)
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
