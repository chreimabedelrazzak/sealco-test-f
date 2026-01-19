export type Category = {
  title: string;
  id: number;
  img: string;
};

export interface Banner {
  id: number;
  titleEn: string;
  subtitleEn: string | null;
  descriptionEn: string | null;
  titleAr: string | null;
  subtitleAr: string | null;
  descriptionAr: string | null;
  linkUrl: string;
  thumbnailImageUrl: string;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  thumbnailImageUrl: string;
}

export interface CategoryDetails {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  displayOrder: number;
  parentId: number | null;
  includeInMenu: boolean;
  isPublished: boolean;
  thumbnailImageUrl: string;
  subCategories: SubCategory[];
  banners: Banner[]; // Added to match the new API response
}

export interface ProductAttribute {
  attributeName: string;
  value: string;
}

export interface ProductImages {
  thumbnails: string[];
  previews: string[];
  fullSize: string[];
}

export interface ProductCategories {
  categoryId: number;
  categoryName: string;
}

// 1. New interface for the dynamic filters
export interface AvailableFilter {
  name: string;      // e.g., "Color", "Size"
  values: string[];  // e.g., ["#707070", "#ffffff"] or ["22", "27"]
}

export interface CategoryProduct {
  id: number;
  productId: number;
  productName: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  // Marking these as optional/nullable as they are sometimes 
  // excluded from the search result JSON to improve performance
  shortDescription?: string | null; 
  description?: string | null;
  stockQuantity?: number;
  reviewsCount?: number;
  categories?: ProductCategories[]; 
  thumbnailImageUrl: string;
  imgs?: ProductImages; 
  attributes: ProductAttribute[];
}

// 2. Updated response wrapper to include availableFilters
export interface CategoryProductResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: CategoryProduct[];
  availableFilters: AvailableFilter[]; // Crucial for the dynamic sidebar
  priceRange: {
    min: number;
    max: number;
  };
}