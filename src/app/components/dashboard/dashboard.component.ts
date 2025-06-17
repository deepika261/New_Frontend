import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService} from '../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//import { HistoryService} from '../../services/history.service';
@Component({
  selector: 'app-ocr-uploader',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  extractedTextList: string[] = [];
  currentImageIndex = 0;
  copiedIndex: number | null = null;
  selectedFile: File | null = null;
  extractedText = '';
  statusMessage = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;
  userId: number=0; // Or dynamically retrieve from login/session later
  copied: boolean=false;
  name:string | null=null;
  constructor(private ocrService: OcrService, private authService: AuthService,private router:Router) { }
  ngOnInit(): void {
    const storedUserId : number = Number(this.authService.getUserId());
    if (storedUserId) {
      this.userId = storedUserId;
      this.name=this.authService.getUserName();
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
  onFileSelected1(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFiles = Array.from(event.target.files);

    // Show preview of the first image only
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFiles[0]);
  }
}
onMultipleFilesSelected1(event: any): void {
  this.selectedFiles = Array.from(event.target.files);

  this.imagePreviewUrls = [];
  for (const file of this.selectedFiles) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrls.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}



uploadFile1(): void {
  this.statusMessage = '';
  this.extractedText = '';

  if (!this.userId) {
    this.statusMessage = 'User ID is missing.';
    return;
  }

  if (this.selectedFiles.length === 0) {
    this.statusMessage = 'Please select at least one file.';
    return;
  }

  this.ocrService.uploadImages(this.selectedFiles).subscribe({
    next: (res: any) => {
      console.log('Upload Success:', res);
      this.statusMessage = res.message || 'Upload successful!';

      // Since the backend returns combinedExtractedText, assign it directly
      if (res.combinedExtractedText) {
        this.extractedText = res.combinedExtractedText;
      } else {
        this.extractedText = 'No text extracted.';
      }
    },
    error: (err) => {
      console.error("Upload failed:", err);
      this.statusMessage = err?.error?.message || 'Upload failed. Server error.';
    }
  });
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
  this.router.navigate(['/dashboard']);

  //window.location.href = '/home'; // or use Angular router: this.router.navigate(['/login']);
}
viewHistory(): void {
  // Navigate to history page (example path: '/history')
  this.router.navigate(['/history']);

  //window.location.href = '/history'; // or use Angular Router: this.router.navigate(['/history']);
}
showZoomModal = false;


onMultipleFilesSelected3(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files).slice(0, 5);
    this.selectedFiles = [...this.selectedFiles, ...newFiles].slice(0, 5); // merge & limit to 5
    this.imagePreviewUrls = this.selectedFiles.map(file => URL.createObjectURL(file));
    this.currentImageIndex = 0;
  }
}
triggerFileInput(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}


prevImage(): void {
  if (this.imagePreviewUrls.length > 0) {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.imagePreviewUrls.length) % this.imagePreviewUrls.length;
  }
}

nextImage(): void {
  if (this.imagePreviewUrls.length > 0) {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imagePreviewUrls.length;
  }
}
downloadText(type: 'pdf' | 'docx'): void {
  if (!this.extractedText) return;
  this.ocrService.downloadExtractedText(this.extractedText, type);
}

removeSelectedFile(index: number): void {
  this.selectedFiles.splice(index, 1);
  this.imagePreviewUrls.splice(index, 1);
  if (this.selectedFiles.length === 0) {
    this.currentImageIndex = 0;
  }
}


}