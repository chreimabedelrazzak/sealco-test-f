export interface CarouselItem {
  image: string | null;
  imageUrl: string | null;
  video: string | null;
  videoUrl: string | null;
  caption: string | null;
  subCaption: string | null;
  linkText: string | null;
  targetUrl: string;
}

export interface CarouselWidgetResponse {
  items: CarouselItem[];
  id: number;
  name: string;
  widgetZoneId: number;
  publishStart: string;
  publishEnd: string | null;
  displayOrder: number;
}