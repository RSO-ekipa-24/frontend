import {
  Component,
  input,
  output,
  viewChild,
  ElementRef,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import {FileUploadChange} from '../../../features/admin/files/models/file.model';
import {FilenameFromUrlPipe} from '../../pipes/file-name-from-url.pipe';
import {FileUrlFromObjectPipe} from '../../pipes/file-url-from-object.pipe';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, TranslatePipe, Button, FilenameFromUrlPipe, FileUrlFromObjectPipe],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  files = input<any[]>([]);

  allowedFileTypes = input<string[]>([]);
  multiple = input<boolean>(true);

  changes = output<FileUploadChange>();

  existingItems: any[] = [];
  newFiles: File[] = [];

  isDragging = false;

  constructor() {
    effect(() => {
      this.existingItems = [...(this.files() ?? [])];
    });
  }

  onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (!event.dataTransfer?.files) return;

    this.addFiles(Array.from(event.dataTransfer.files));
  }

  private addFiles(files: File[]) {
    this.newFiles = this.multiple()
      ? [...this.newFiles, ...files]
      : files.slice(0, 1);

    this.emit();
  }

  removeExisting(event: Event, item: any) {
    event.stopPropagation();
    this.existingItems = this.existingItems.filter(i => i !== item);
    this.emit();
  }

  removeNew(event: Event, file: File) {
    event.stopPropagation();
    this.newFiles = this.newFiles.filter(f => f !== file);
    this.emit();
  }

  private emit() {
    this.changes.emit({
      addedFiles: this.newFiles,
      items: this.existingItems,
    });
  }

  triggerFileSelect() {
    this.fileInput()?.nativeElement.click();
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  reset() {
    this.existingItems = [...(this.files() ?? [])];
    this.newFiles = [];
    this.emit();
  }
}
