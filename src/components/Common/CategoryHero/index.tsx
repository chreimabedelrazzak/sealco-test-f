"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import CategoryHeroCard from "./CategoryHeroCard";
import { Banner } from "@/types/Category"; // Adjust the import path as needed

interface CategoryHeroProps {
  banners?: Banner[];
}

const CategoryHero = ({ banners }: CategoryHeroProps) => {
  // If no banners exist, we can return null or a default placeholder
  if (!banners || banners.length === 0) return null;

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel ah-115 max-w-[1400px]"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <CategoryHeroCard
            title={banner.titleEn}
            description={banner.descriptionEn}
            buttonLink={banner.linkUrl}
            // Using the requested image URL format
            image={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${banner.thumbnailImageUrl}`}
          />
        </SwiperSlide>
      ))}
      <div className="swiper-pagination !bottom-5"></div>
    </Swiper>
  );
};

export default CategoryHero;