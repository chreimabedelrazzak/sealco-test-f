export interface NewsItemSummary {
  id: number;
  name: string;
  shortContent: string | null; // Added
  publishedDate: string;       // Added
  thumbnailImageUrl: string | null; // Added
}

export interface NewsItemResponse {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  shortContent: string | null;
  fullContent: string | null;
  isPublished: boolean;
  publishedDate: string;  
  thumbnailImageUrl: string | null;
  newsCategoryIds: number[];
  thumbnailImage: string | null;
}

export interface NewsCategorySummary {
  id: number;
  name: string;
  slug: string;
  newsItems: NewsItemSummary[];
}

export interface NewsCategoryDetailResponse {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  items: NewsItemResponse[];
}