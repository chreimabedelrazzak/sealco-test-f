
// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import HeroCardOne from "./HeroCardOne";
// const HeroCarousel = () => {
//   return (
//     <Swiper
//       spaceBetween={0}
//       centeredSlides={true}
//       pagination={{ clickable: true }}
//       modules={[Autoplay, Pagination]}
//       className="hero-carousel h-full"
//     >
//       {" "}
//       {/* SLIDE 1 */}{" "}
//       <SwiperSlide>
//         {" "}
//         <HeroCardOne
//           subtitle="Shop in a"
//           title="New Reality"
//           buttonText="Learn more"
//           description="Visit our virtual showroom now"
//           image="/images/hero/main-01.png"
//         />{" "}
//       </SwiperSlide>{" "}
//       {/* SLIDE 2 */}{" "}
//       <SwiperSlide>
//         {" "}
//         <HeroCardOne 
//           subtitle="Shop in a"
//           title="New Reality"
//           buttonText="Learn more"
//           description="Visit our virtual showroom now"
//           image="/images/hero/main-01.png"
//         />{" "}
//       </SwiperSlide>{" "}
//       <div className="swiper-pagination !bottom-5"></div>
//     </Swiper>
//   );
// };
// export default HeroCarousel;
"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import HeroCardOne from "./HeroCardOne";
import { widgetService } from "@/services/carouselService";
import { CarouselItem } from "@/types/Carousel";

const HeroCarousel = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        // Fetching widget with ID 1 as per your requirements
        const data = await widgetService.getCarouselWidget(1);
        setItems(data.items);
      } catch (error) {
        console.error("Failed to load hero carousel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidget();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[630px] 2xl:min-h-[700px] ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 50000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel h-full 3xl:max-w-[1500px] px-8"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <HeroCardOne
            subtitle={item.subCaption || ""}
            title={item.caption || ""}
            buttonText={item.linkText || "Learn more"}
            description={"Visit our virtual showroom now"} // Map to an API field if available
            targetUrl={item.targetUrl}
            // Use videoUrl if available, otherwise fallback to imageUrl
            video={item.video && item.video !== "null" ? item.videoUrl : null}
            image={item.image && item.image !== "null" ? item.imageUrl : null}
          />
        </SwiperSlide>
      ))}
      <div className="swiper-pagination !bottom-5"></div>
    </Swiper>
  );
};

export default HeroCarousel;