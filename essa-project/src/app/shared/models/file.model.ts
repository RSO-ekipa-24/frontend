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
