import {Component, inject, input, output} from '@angular/core';
import { Button } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    FileUploadModule,
    TranslatePipe,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  // Inputs
  allowedFileTypes = input<string[]>([]);
  multiple = input<boolean>(true);

  // Output - now emits the current selected files whenever they change
  onFilesSelected = output<File[]>();

  private currentFiles: File[] = [];

  choose(event: any, callback: Function) {
    callback();
  }

  onSelectedFiles(event: any) {
    this.currentFiles = event.currentFiles;
    this.emitFiles();
  }

  onRemoveFile(event: any, file: File, removeCallback: Function, index: number) {
    removeCallback(event, index);
    this.currentFiles = event.currentFiles;
    this.emitFiles();
  }

  private emitFiles() {
    this.onFilesSelected.emit(this.currentFiles);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
