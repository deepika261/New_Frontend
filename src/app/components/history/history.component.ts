import { Component } from '@angular/core';
import { HistoryService, FileItem } from '../../services/history.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private historyService: HistoryService) {}

  fetchHistory(): void {
    if (!this.email) return;

    this.historyService.getLast10Files(this.email).subscribe(data => {
      this.files = data.map(file => ({
         ...file,
        imageUrl: this.convertPathToUrl(file.filePath)
      }));
      this.isDataLoaded = true;
    });
  }

  convertPathToUrl(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop();
    return `https://localhost:44312/Uploads/${fileName}`;
  }

  openImageModal(imageUrl: string): void {
    this.zoomedImageUrl = imageUrl;
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }

  onExtractText(file: FileItem): void {
    this.historyService.getExtractedText(file.id).subscribe(res => {
      this.selectedText = res.text;
      this.selectedFileName = file.fileName;
    });
  }

  download(type: 'pdf' | 'docx'): void {
    if (!this.selectedText || !this.selectedFileName) return;
    this.historyService.downloadText(this.selectedFileName, this.selectedText, type);
  }
}
