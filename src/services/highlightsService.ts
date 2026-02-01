import { apiClient } from './apiClient';
import { 
  NewsCategorySummary, 
  NewsCategoryDetailResponse, 
  NewsItemResponse 
} from '../types/highlights';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:49206";
const BASE_IMG_URL = process.env.NEXT_PUBLIC_BASE_IMG_URL || "https://localhost:49206"
/**
 * Service to handle News Category and Highlight-related APIs
 */
export const highlightService = {
  /**
   * Gets the list of all news categories
   * GET /api/news-categories
   */
  getCategories: async (): Promise<NewsCategorySummary[]> => {
    try {
      const response = await apiClient.get<NewsCategorySummary[]>('/news-categories');
      return response.data;
    } catch (error: any) {
      console.error("Get News Categories API Error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Gets full details for a category, including full objects of its news items
   * GET /api/news-categories/{id}
   */
  getCategoryById: async (id: number): Promise<NewsCategoryDetailResponse> => {
    try {
      const response = await apiClient.get<NewsCategoryDetailResponse>(`/news-categories/${id}`);
      
      // Construct full URLs for news item thumbnails within the category
      const itemsWithUrls = response.data.items.map(item => ({
        ...item,
        thumbnailImageUrl: item.thumbnailImageUrl 
          ? `${BASE_IMG_URL}${item.thumbnailImageUrl}` 
          : null
      }));

      return { ...response.data, items: itemsWithUrls };
    } catch (error: any) {
      console.error(`Get News Category By ID (${id}) Error:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Gets full details for a specific news item (HTML content, meta tags, etc.)
   * GET /api/news-items/{id}
   */
  getNewsItemById: async (id: number): Promise<NewsItemResponse> => {
    try {
      const response = await apiClient.get<NewsItemResponse>(`/news-items/${id}`);
      
      // Construct full URL for the thumbnail
      if (response.data.thumbnailImageUrl) {
        response.data.thumbnailImageUrl = `${BASE_IMG_URL}${response.data.thumbnailImageUrl}`;
      }

      return response.data;
    } catch (error: any) {
      console.error(`Get News Item By ID (${id}) Error:`, error.response?.data || error.message);
      throw error;
    }
  }
};