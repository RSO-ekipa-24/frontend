export interface FileUploadRequest {
  fileName: string;
  contentType: string;
  size: number;
  propertyId?: string;
  tagNames?: string[];
}

export interface FileUploadResponse {
  id: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface FileMetadataResponse {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  dateUploaded: string;
  dateModified: string;
  status: 'AVAILABLE' | 'DELETED' | 'PENDING';
  tags: string[];
}

export interface FileDownloadResponse {
  downloadUrl: string;
}

export interface PropertyThumbnailsResponse {
  propertyId: number;
  thumbnailUrl: string | null;
}

export interface ImagePreviewResponse {
  id: string;
  imageUrl: string | null;
  tags: string[];
}

export interface FileUploadChange {
  addedFiles: File[];
  items: any[];
}
