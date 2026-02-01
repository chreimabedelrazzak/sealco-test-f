import { 
  ProductBarcodeCategory, 
  BarcodeVerificationResult 
} from "@/types/validateProduct";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:49206/api/product-barcodes";

export const validateProductService = {
  /**
   * Fetches all published product categories for the validation selection
   */
  getCategories: async (): Promise<ProductBarcodeCategory[]> => {
    try {
      const response = await fetch(`${BASE_URL}/product-barcodes/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data: ProductBarcodeCategory[] = await response.json();
      
      // Filter out unpublished or deleted categories on the frontend for safety
      return data.filter(cat => cat.isPublished === 1 && cat.isDeleted === 0);
    } catch (error) {
      console.error("Error in getCategories:", error);
      return [];
    }
  },

  /**
   * Verifies if a serial number exists in the SEALCO database
   */
  verifySerialNumber: async (serialNumber: string): Promise<BarcodeVerificationResult | null> => {
    try {
      const response = await fetch(`${BASE_URL}/product-barcodes/verify/${serialNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Do not cache verification results
      });

      if (!response.ok) {
        throw new Error(`Verification request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in verifySerialNumber:", error);
      return {
        serialNumber,
        success: false,
        message: "Network error during verification"
      };
    }
  }
};