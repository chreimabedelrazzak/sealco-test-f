import { apiClient } from './apiClient';
import { CarouselWidgetResponse } from '@/types/Carousel';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export const widgetService = {
  getCarouselWidget: async (id: number): Promise<CarouselWidgetResponse> => {
    try {
      const response = await apiClient.get<CarouselWidgetResponse>(
        `/carousel-widgets/${id}`
      );

      // Construct full URLs for media items
      const itemsWithFullUrls = response.data.items.map(item => ({
        ...item,
        imageUrl: item.imageUrl ? `${BASE_URL}${item.imageUrl}` : null,
        videoUrl: item.videoUrl ? `${BASE_URL}${item.videoUrl}` : null,
      }));

      return { ...response.data, items: itemsWithFullUrls };
    } catch (error: any) {
      console.error(`Get Carousel Widget ${id} Error:`, error.message);
      throw error;
    }
  },
};