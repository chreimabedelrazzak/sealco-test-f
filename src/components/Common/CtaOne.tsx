// import React from "react";
// import Image from "next/image";

// interface NewsletterProps {
//   title: string;
//   description: string;
//   buttonText: string;
//   image: string;
// }

// export default function Newsletter({
//   title,
//   description,
//   buttonText,
//   image,
// }: NewsletterProps) {
//   return (
//     <section className="w-full overflow-hidden mb-20 md:mb-10 ">
//       <div className="relative w-full h-[240px] sm:h-[360px] lg:h-[300px] flex items-center">
//         {/* Background Image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${image})` }}
//         />

//         {/* Dark Gradient Overlay (left side only) */}
//         <div className="absolute inset-0 bg-gradient-to-br from-[#272727] via-[#272727]/80 via-20% to-transparent" />

//         {/* Content */}
//         <div className="relative z-10 2xl:max-w-[1600px] mx-auto w-full px-6 xl:px-8">
//           <div className="max-w-[420px] text-left px-4">
//             <h2 className="text-white font-bold text-3xl sm:text-4xl leading-snug mb-4">
//               {title}
//             </h2>

//             <p className="text-white text-base sm:text-lg mb-6">
//               {description}
//             </p>

//             <a
//             href="#"
//             className="inline-flex font-bold text-white text-sm md:text-base rounded-3xl bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
//           >
//             {buttonText}
//           </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { widgetService } from "@/services/carouselService";
import { CarouselItem } from "@/types/Carousel";

interface CtaOneProps {
  widgetId: number;
}

export default function CtaOne({ widgetId }: CtaOneProps) {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const data = await widgetService.getCarouselWidget(widgetId);
        if (data.items) {
          setItems(data.items);
        }
      } catch (error) {
        console.error(`Failed to load CtaOne (ID: ${widgetId}):`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidgetData();
  }, [widgetId]);

  if (isLoading) {
    return (
      <div className="flex h-[340px] items-center justify-center bg-[#F8F8F8] mb-20 md:mb-10 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#116DB2]"></div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full overflow-hidden mb-20 md:mb-10">
      <div className="w-full 2xl:max-w-[1500px] mx-auto">
      <Swiper
        spaceBetween={0}
        effect={"fade"}
        centeredSlides={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="cta-one-swiper h-full w-full"
      >
        {items.map((item, index) => {
          const hasVideo = item.video && item.video !== "null";
          const hasImage = item.image && item.image !== "null";

          return (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[350px] flex items-center ">
                
                {/* MEDIA LAYER (BACKGROUND) */}
                <div className="absolute inset-0 z-0">
                  {hasVideo ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={item.videoUrl} type="video/mp4" />
                    </video>
                  ) : hasImage ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#272727]" />
                  )}
                </div>

                {/* GRADIENT OVERLAY (For Text Readability) */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* CONTENT LAYER */}
                <div className="relative z-10 2xl:max-w-[1600px] mx-auto w-full px-6 xl:px-8">
                  <div className="max-w-[500px] text-left apx-4">
                    <h2 className="text-white font-bold text-[38px] 2xl:text-[44px]leading-tight mb-4 drop-shadow-sm">
                      {item.caption}
                    </h2>

                    <p className="text-white/90 text-sm sm:text-lg mb-6 line-clamp-3">
                      {item.subCaption}
                    </p>

                    <a
                      href={item.targetUrl || "#"}
                      className="inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-7 hover:bg-[#AD003A] transition-all duration-300 shadow-md"
                    >
                      {item.linkText || "Discover More"}
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="swiper-pagination !bottom-4"></div>
      </Swiper>
      </div>
    </section>
  );
}