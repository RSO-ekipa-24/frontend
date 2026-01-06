import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Observable, switchMap} from 'rxjs';
import {
  FileUploadRequest,
  FileUploadResponse,
  ImagePreviewResponse,
  PropertyThumbnailsResponse
} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = `${environment.filesUrl}/image`;

  constructor() {}

  uploadImage(file: File, propertyId?: string, tagNames: string[] = []): Observable<FileUploadResponse> {
    const request: FileUploadRequest = {
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
      propertyId,
      tagNames
    };

    return this.initiateImageUpload(request).pipe(
      switchMap((response) =>
        this.uploadFileToPresignedUrl(response.uploadUrl, file).pipe(
          // Return the original response (with id, expiresAt, etc.) after successful upload
          switchMap(() => [response])
        )
      )
    );
  }

  getThumbnailsForProperties(propertyIds: number[]): Observable<PropertyThumbnailsResponse[]> {
    let params = new HttpParams();
    propertyIds.forEach(id => params = params.append('propertyId', id.toString()));
    return this.http.get<PropertyThumbnailsResponse[]>(`${this.baseUrl}/thumbnails`, { params });
  }

  getImagesForProperty(propertyId: number): Observable<ImagePreviewResponse[]> {
    return this.http.get<ImagePreviewResponse[]>(`${this.baseUrl}/property/${propertyId}`);
  }

  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${imageId}`);
  }

  deleteImagesOfProperty(propertyId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/delete-property-images/${propertyId}`
    );
  }

  private initiateImageUpload(request: FileUploadRequest): Observable<FileUploadResponse> {
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/upload`, request);
  }

  private uploadFileToPresignedUrl(uploadUrl: string, file: File): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': file.type || 'application/octet-stream'
    });

    return this.http.put<void>(uploadUrl, file, {
      headers,
      responseType: 'text' as 'json'
    });
  }
}
