export interface ProductCategory {
  categoryId: number;
  categoryName: string;
}

export interface ProductAttribute {
  attributeName: string;
  value: string;
}

export type Product = {
  id: number;
  productId: number;
  productName: string;
  slug: string;
  price: number;
  oldPrice: number;
  shortDescription: string;
  description: string;
  stockQuantity: number;
  reviewsCount: number;
  categories: ProductCategory[]; // Added to match JSON
  thumbnailImageUrl: string;
  imgs: {
    thumbnails: string[];
    previews: string[];
    fullSize: string[];
  };
  attributes: ProductAttribute[];
  
  // UI Helper fields (Derived or state-managed)
  title?: string;            
  discountedPrice?: number;  
};