// import Link from "next/link";
// import React from "react";
// import BreadCrumbBanner from "./BreadCrumbBanner";

// const BreadcrumbFour = ({ title, pages }) => {
//   return (
//     <div className="overflow-hidden">
//       <div className="border-t border-gray-3">
//         <div className="w-full 2xl:max-w-[1400px] px-4 mx-auto sm:px-8 pb-4 pt-4 axl:pb-10">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//             <ul className="flex items-center gap-2 ">
//               <li className="text-sm hover:text-[#116DB2]">
//                 <Link href="/">Home /</Link>
//               </li>

//               {pages.length > 0 &&
//                 pages.map((page, key) => (
//                   <li
//                     className="text-sm font-regular last:text-[#116DB2] capitalize"
//                     key={key}
//                   >
//                     {page}
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>
//         <BreadCrumbBanner image="/images/categories/category-banner.jpg"/>
//       </div>
//     </div>
//   );
// };

// export default BreadcrumbFour;
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BreadCrumbBanner from "./BreadCrumbBanner";
// Import your api object where getCarouselWidget is defined
import { widgetService } from "@/services/carouselService";
import { CarouselItem, CarouselWidgetResponse } from "@/types/Carousel";

interface BreadcrumbProps {
  carouselId: number;
  pages: string[];
}

const BreadcrumbFour = ({ carouselId, pages }: BreadcrumbProps) => {
  const [carouselData, setCarouselData] =
    useState<CarouselWidgetResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await widgetService.getCarouselWidget(carouselId);
        setCarouselData(data);
      } catch (error) {
        console.error("Failed to load breadcrumb carousel", error);
      } finally {
        setLoading(false);
      }
    };

    if (carouselId) {
      fetchCarousel();
    }
  }, [carouselId]);

  // Use the first item from the carousel for the banner
  const heroItem = carouselData?.items?.[0];

  return (
    <div className="overflow-hidden">
      <div className="border-t border-gray-3">
        <div className="w-full 2xl:max-w-[1500px] mx-auto px-8 pb-4 pt-4 axl:pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <ul className="flex items-center gap-2 ">
              <li className="text-sm hover:text-[#116DB2]">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li
                    className="text-sm font-regular last:text-[#116DB2] capitalize"
                    key={key}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Media Display Logic */}
        {!loading && heroItem && (
          <div className="relative">
            {heroItem.videoUrl && heroItem.video !== "null" ? (
              <div className="w-full h-[300px] overflow-hidden">
                <video
                  src={heroItem.videoUrl}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <BreadCrumbBanner
                image={
                  heroItem.imageUrl || "/images/categories/category-banner.jpg"
                }
              />
            )}

            {/* Caption Overlay */}
            {(heroItem.caption || heroItem.subCaption) && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full 2xl:max-w-[1500px] mx-auto px-8 h-full flex flex-col justify-end pb-28 2xl:pb-40">
                  {/* Adjust pb-12 (bottom padding) or justify-end to move the text up/down. 
         Using flex-col and justify-end is often more reliable than top percentage.
      */}
                  {heroItem.caption && (
                    <h1 className="text-[60px] 2xl:text-[66px] font-bold text-white leading-tight">
                      {heroItem.caption}
                    </h1>
                  )}
                  {heroItem.subCaption && (
                    <p className="text-lg text-white mt-2">
                      {heroItem.subCaption}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreadcrumbFour;
