import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FileItem {
  id: number;
  fileName: string;
  filePath: string;
  extractedText?: string;
  uploadedAt: string;
  imageUrl?: string; // computed on the frontend
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl = 'https://localhost:5085/api/history';

  constructor(private http: HttpClient) {}

  /**
   * Get the last 10 uploaded files for a specific user by email.
   */
  getLast10Files(email: string): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.baseUrl}/last10/${email}`);
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
    link.download = `${fileName}.${type}`;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
}
