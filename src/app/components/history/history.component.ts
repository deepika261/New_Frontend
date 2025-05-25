import { Component, ViewChild, ElementRef } from '@angular/core';
import { HistoryService, FileItem } from '../../services/history.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Adjust path as needed


declare var bootstrap: any;

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  email = '';
  files: FileItem[] = [];
  selectedText: string | null = null;
  zoomedImageUrl: string | null = null;
  selectedFileName: string | null = null;
  isDataLoaded = false;
  userId: number=0;
  statusMessage = '';
  //selectedText: string = "";

  constructor(private historyService: HistoryService, private authService: AuthService) {}
  ngOnInit(): void {
    const storedUserId : number = Number(this.authService.getUserId());
    console.log(storedUserId);
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      this.statusMessage = 'User not authenticated.';
    }
  }
  fetchHistory(): void {
    console.log('fetchHistory called');
    this.files = [];
    this.isDataLoaded=false;
    this.historyService.getLast10Files().subscribe(data => {
      console.log('Data received:', data);
      this.files = data.map((file: any) => ({
         ...file,
        imageUrl: this.convertPathToUrl(file.filePath),
        fileName: file.fileName || this.extractFileName(file.filePath),
        //id: file.id || 0
      }));
      this.isDataLoaded = true;
    },
    error=>{
      console.error('Error fetching history:', error);
    });
    
  }
  extractFileName(filePath: string): string {
    return filePath.split(/[/\\]/).pop() || 'unknown';
  }
 
  convertPathToUrl(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop();
    return `http://localhost:5085/Uploads/${fileName}`;
  }

  openImageModal(imageUrl: string): void {
    this.zoomedImageUrl = imageUrl;
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }

  onExtractText(file: FileItem): void {
    // If extractedText is already available, use it directly
    if (file.extractedText) {
      this.selectedText = file.extractedText;
      this.selectedFileName = file.fileName;
    } 
  }

  download(type: 'pdf' | 'docx'): void {
    if (!this.selectedText || !this.selectedFileName) return;
    this.historyService.downloadText(this.selectedFileName, this.selectedText, type);
  }
}