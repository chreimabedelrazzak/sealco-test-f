import { PagePublicView } from "@/types/page";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:49206";

export const pageService = {
  getBySlug: async (slug: string): Promise<PagePublicView | null> => {
    try {
      const res = await fetch(`${API_URL}/api/pages/by-slug/${slug}`, {
        // Incremental Static Regeneration: Cache for 1 hour, 
        // but revalidate if a request comes in after that.
        next: { revalidate: 3600, tags: ['pages'] } 
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch page");

      return res.json();
    } catch (error) {
      console.error(`Error fetching page ${slug}:`, error);
      return null;
    }
  }
};