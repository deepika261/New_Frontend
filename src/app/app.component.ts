import { Component } from '@angular/core';
import { OcrUploaderComponent } from './components/ocr/ocr.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,OcrUploaderComponent],
  template: `<app-ocr-uploader></app-ocr-uploader>`,
  //templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ocr-text-extractor';
}
