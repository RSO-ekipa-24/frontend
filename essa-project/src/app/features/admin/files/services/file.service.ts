import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {from, Observable, switchMap, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {
  FileUploadRequest,
  FileUploadResponse,
  FileMetadataResponse,
} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.filesUrl}/file`;

  uploadFile(
    file: File,
    fileName: string,
    propertyId?: string,
    tagNames: string[] = []
  ): Observable<FileUploadResponse> {
    const request: FileUploadRequest = {
      fileName: fileName,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
      propertyId,
      tagNames,
    };

    return this.initiateUpload(request).pipe(
      switchMap((response) =>
        this.uploadToPresignedUrl(response.uploadUrl, file).pipe(
          switchMap(() => [response])
        )
      )
    );
  }

  getAllFiles(): Observable<FileMetadataResponse[]> {
    return this.http.get<FileMetadataResponse[]>(this.baseUrl);
  }

  getFileMetadata(id: string): Observable<FileMetadataResponse> {
    return this.http.get<FileMetadataResponse>(`${this.baseUrl}/${id}`);
  }

  downloadFile(id: string, fileName: string): Observable<void> {
    return this.http.get(`${this.baseUrl}/download/${id}`, { responseType: 'text' }).pipe(
      switchMap((signedUrl: string) => {
        return from(
          fetch(signedUrl.replace(/^"|"$/g, ''))
            .then(res => {
              if (!res.ok) throw new Error('Could not fetch file from storage');
              return res.blob();
            })
            .then(blob => this.triggerBrowserDownload(blob, fileName))
        );
      })
    );
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getDeletedFiles(): Observable<FileMetadataResponse[]> {
    return this.http.get<FileMetadataResponse[]>(`${this.baseUrl}/deleted`);
  }

  restoreFile(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/restore/${id}`, null);
  }

  private initiateUpload(request: FileUploadRequest): Observable<FileUploadResponse> {
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/upload`, request);
  }

  private uploadToPresignedUrl(uploadUrl: string, file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': file.type || 'application/octet-stream',
    });

    return this.http.put(uploadUrl, file, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  private triggerBrowserDownload(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const blobUrl = URL.createObjectURL(blob);
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(blobUrl);
    a.remove();
  }
}
