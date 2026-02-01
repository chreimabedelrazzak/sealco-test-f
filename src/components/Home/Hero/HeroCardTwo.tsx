// "use client";

// interface HeroCard {
//   title: string;
//   subtitle: string;
//   description: string;
//   buttonText: string;
//   image: string;
// }

// export default function HeroCardTwo({
//   title,
//   subtitle,
//   buttonText,
//   description,
//   image,
// }: HeroCard) {
//   return (
//     <section className="mb-20 md:mb-10 relative w-full h-full min-h-[500px] md:min-h-[600px] 2xl:min-h-[800px] bg-[#F8F8F8] overflow-hidden flex flex-col md:flex-row items-center">

//       {/* CONTENT LAYER - Moved up in the DOM so it renders first on mobile */}
//       <div className="relative z-10 w-full 2xl:max-w-[1600px] mx-auto px-6 xl:px-8 flex flex-col justify-start pt-16 md:pt-0 md:h-full md:justify-center">
//         <div className="px-4 w-full md:max-w-[600px] lg:max-w-[550px] text-center md:text-left flex flex-col items-center md:items-start">
//           <span className="block text-[#000000] sm:leading-[45px] font-semibold text-xl sm:text-5xl axl:text-7xl">
//             {title}
//           </span>
//           <span className="block text-[#000000] font-semibold text-xl sm:text-3xl mb-3">
//             {subtitle}
//           </span>
//           <p className="text-lg text-[#000000] font-medium mb-3">
//             {description}
//           </p>
//           <a
//             href="#"
//             className="inline-flex font-bold text-white text-sm md:text-base rounded-3xl bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
//           >
//             {buttonText}
//           </a>
//         </div>
//       </div>

//       {/* IMAGE LAYER
//           Changed to 'relative' and 'h-[300px]' on mobile to force it below text.
//           Kept 'md:absolute' and 'md:inset-0' to maintain desktop design.
//       */}
//       <div
//         className="relative md:absolute md:inset-0 z-0 w-full h-[350px] sm:h-[450px] md:h-full mt-auto max-w-[1400px] 2xl:max-w-[1600px] mx-auto bg-no-repeat
//                    bg-bottom bg-contain
//                    md:bg-right-bottom md:bg-contain transition-all duration-700"
//         style={{
//           backgroundImage: `url(${image})`,
//           backgroundPosition: 'center bottom', /* Forces image to the very bottom pixel */
//         }}
//       />

//     </section>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; // Added for a smoother background transition

import { widgetService } from "@/services/carouselService";
import { CarouselItem } from "@/types/Carousel";

interface HeroCardTwoProps {
  widgetId: number;
}

export default function HeroCardTwo({ widgetId }: HeroCardTwoProps) {
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
        console.error(`Failed to load HeroCardTwo (ID: ${widgetId}):`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidgetData();
  }, [widgetId]);

  if (isLoading) {
    return (
      <div className="flex h-[500px] md:h-[600px] 2xl:h-[800px] items-center justify-center bg-[#F8F8F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#116DB2]"></div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="relative w-full mb-20 md:mb-10 ">
      <Swiper
        spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 50000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination]}
              className="hero-carousel h-full z:max-w-[1500px] px-8"
      >
        {items.map((item, index) => {
          const hasVideo = item.video && item.video !== "null";
          const hasImage = item.image && item.image !== "null";

          return (
            <SwiperSlide key={index}>
              <section className="relative w-full min-h-[740px] 2xl:min-h-[760px] overflow-hidden flex items-center">
                  {/* MEDIA LAYER (BACKGROUND) */}
                  <div className="absolute inset-0 z-0 w-full h-full flex justify-center items-center">
                    <div className="w-full h-full z:max-w-[1500px]">
                    {hasVideo ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover" // Fills the entire div
                      >
                        <source src={item.videoUrl} type="video/mp4" />
                      </video>
                    ) : hasImage ? (
                      <div
                        className="w-full h-full min-h-[740px] 2xl:min-h-[760px] bg-no-repeat bg-center bg-cover transition-all duration-700"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F8F8F8]" />
                    )}
                    </div>
                    {/* Optional Overlay to ensure text readability */}
                    <div className="absolute inset-0 abg-black/10 md:bg-transparent" />
                  </div>

                  {/* CONTENT LAYER (OVERLAY) */}
                  <div className="relative z-10 w-full mx-auto px-8 z:max-w-[1500px]">
                    <div className=" w-full md:max-w-[650px] lg:max-w-[500px] text-center md:text-left flex flex-col items-center md:items-start">
                      <span className="block text-white md:text-[#000000] drop-shadow-md md:drop-shadow-none leading-[2.6rem] font-bold text-[38px] 2xl:text-[44px] pb-10">
                        {item.caption}
                      </span>
                      <span className="block text-white md:text-[#000000] drop-shadow-sm md:drop-shadow-none text-[21px] 2xl:text-[23px] font-semibold pb-4">
                        {item.subCaption}
                      </span>
                      <a
                        href={item.targetUrl || "#"}
                        className="inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md"
                      >
                        {item.linkText || "Learn more"}
                      </a>
                    </div>
                  </div>
              </section>
            </SwiperSlide>
          );
        })}
        <div className="swiper-pagination !bottom-8"></div>
      </Swiper>
    </div>
  );
}
