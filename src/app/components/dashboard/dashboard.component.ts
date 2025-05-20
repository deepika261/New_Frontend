import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-ocr-uploader',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedFile: File | null = null;
  extractedText = '';
  statusMessage = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;
  userId: number=0; // Or dynamically retrieve from login/session later
  copied=false;
  constructor(private ocrService: OcrService, private authService: AuthService) { }
  ngOnInit(): void {
    const storedUserId : number = Number(this.authService.getUserId());
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      this.statusMessage = 'User not authenticated.';
    }
  }

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


  uploadFile(): void {
    this.statusMessage = '';
    this.extractedText = '';
    if (!this.userId) {
      this.statusMessage = 'User ID is missing.';
      return;
    }
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
logout(): void {
  // Clear any auth tokens or session data if used
  // Redirect to login page
  localStorage.clear(); // Optional: if you're storing session info
  window.location.href = '/home'; // or use Angular router: this.router.navigate(['/login']);
}
viewHistory(): void {
  // Navigate to history page (example path: '/history')
  window.location.href = '/history'; // or use Angular Router: this.router.navigate(['/history']);
}




}