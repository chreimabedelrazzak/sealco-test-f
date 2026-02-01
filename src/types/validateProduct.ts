export interface ProductBarcodeCategory {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageId: number | null;
  priority: number;
  isPublished: number; // 1 for true, 0 for false
  isDeleted: number;   // 1 for true, 0 for false
  createdDate: string; // ISO format string from .NET DateTime
}

export interface BarcodeVerificationResult {
  serialNumber: string;
  success: boolean;
  message: string;
}