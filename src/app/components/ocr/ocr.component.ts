import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../services/ocr.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ocr-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css']
})
export class OcrUploaderComponent {
  selectedFile: File | null = null;
  extractedText = '';
  statusMessage = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;

  constructor(private ocrService: OcrService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /*onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }*/

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //   }
  // }

  uploadFile(): void {
    this.statusMessage = '';
    this.extractedText = '';
    if (!this.selectedFile) {
      this.statusMessage = 'Please select a file.';
      return;
    }

    this.ocrService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        console.log('Upload Success:', res)
        this.statusMessage = 'Upload successful!';
        this.getExtractedText();
      },
      error: (err) => {
        console.error("Upload failed:", err); // Full backend error
        this.statusMessage = err?.errorr?.message || 'Upload failed. Server error.';
      }
    });
  }

  getExtractedText(): void {
    this.ocrService.getExtractedText().subscribe({
      next: (res) => {
        this.extractedText = res.extractedText;
      },
      error: () => {
        this.statusMessage = 'Failed to fetch extracted text.';
      }
    });
  }

  downloadFile(type: 'docx' | 'pdf'): void {
    const downloadObs = type === 'docx' ? this.ocrService.downloadDocx() : this.ocrService.downloadPdf();

    downloadObs.subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ExtractedText.${type}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.statusMessage = `Failed to download ${type.toUpperCase()} file.`;
      }
    });
  }
  copied = false;

copyText() {
  const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (textArea) {
    textArea.select();
    document.execCommand('copy');

    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2000); // show "Copied!" for 2 seconds
  }
}

}
