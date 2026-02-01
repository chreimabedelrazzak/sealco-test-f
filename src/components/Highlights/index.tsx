// "use client";
// import React from "react";
// import Image from "next/image";
// import BreadcrumbFour from "../Common/BreadcrumbFour";
// import Link from "next/link";

// // Data structure based on the design
// const highlightsData = [
//   {
//     id: 1,
//     title: "LG shows off the new smart TVs",
//     date: "November 30, 2025",
//     description:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house, LG's stylish & innovative appliances are built to suit your lifestyle. Learn more below.",
//     extraText:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house.",
//     image: "/images/highlights/01.avif", // Update with your actual image paths
//   },
//   {
//     id: 2,
//     title: "LG shows off the new smart TVs",
//     date: "November 30, 2025",
//     description:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house, LG's stylish & innovative appliances are built to suit your lifestyle. Learn more below.",
//     extraText:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house.",
//     image: "/images/highlights/01.avif",
//   },
//   {
//     id: 3,
//     title: "LG shows off the new smart TVs",
//     date: "November 30, 2025",
//     description:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house, LG's stylish & innovative appliances are built to suit your lifestyle. Learn more below.",
//     extraText:
//       "Make the most out of life. Whether you're replacing a kitchen appliance, upgrading your laundry or furnishing your whole house.",
//     image: "/images/highlights/01.avif",
//   },
// ];

// const SingleHighlight = ({ item }: { item: (typeof highlightsData)[0] }) => {
//   return (
//     <div className="flex flex-col md:flex-row gap-8 items-start py-12 last:border-0">
//       <div className="w-full md:w-[40%] shrink-0">
//         <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-gray-100">
//           <Image src={item.image} alt={item.title} fill className="object-cover" />
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col items-start text-start">
//         {/* REDIRECT: Wrapped title in Next.js Link */}
//         <Link
//           href={`/highlights/${item.id}`}
//           className="text-xl font-bold text-[#000000] mb-1 hover:text-[#116DB2] transition-colors"
//         >
//           {item.title}
//         </Link>
//         <p className="text-xs font-medium text-gray-400 mb-4">{item.date}</p>
//         <div className="w-12 h-[2px] bg-[#116DB2] mb-6"></div>
//         <div className="space-y-4">
//           <p className="text-sm font-medium text-gray-800 leading-relaxed">{item.description}</p>
//           <p className="text-sm font-medium text-gray-800 leading-relaxed">{item.extraText}</p>
//         </div>
//       </div>

// <div className="hidden lg:flex flex-col gap-1 pt-0">
//   {[
//     { id: "link", src: "/images/social/linkedin.png", alt: "linkedin" },
//     { id: "in", src: "/images/social/insta.png", alt: "instagram" },
//     { id: "x", src: "/images/social/x.png", alt: "x" },
//     { id: "p", src: "/images/social/pinterest.png", alt: "pinterest" },
//     { id: "f", src: "/images/social/facebook.png", alt: "facebook" },
//   ].map((social) => (
//     <a key={social.id} href="#" className="w-8 h-8 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors">
//       <Image src={social.src} alt={social.alt} width={33} height={33} className="object-contain p-1.5" />
//     </a>
//   ))}
// </div>
//     </div>
//   );
// };

// export default function Heighlights() {
//   return (
//     <div className="bg-white min-h-screen">
//       <BreadcrumbFour  pages={["Highlights"]} carouselId={15} />
//       <section className="py-12 lg:py-20">
//         <div className="2xl:max-w-[1400px] w-full mx-auto px-8">
//           <div className="flex flex-col">
//             {highlightsData.map((item) => (
//               <SingleHighlight key={item.id} item={item} />
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BreadcrumbFour from "../Common/BreadcrumbFour";
import Link from "next/link";
import { highlightService } from "@/services/highlightsService";
import {
  NewsCategorySummary,
  NewsCategoryDetailResponse,
  NewsItemResponse,
} from "@/types/highlights";

const SingleHighlight = ({
  item,
  onTitleClick,
}: {
  item: any;
  onTitleClick: () => void;
}) => {
  useEffect(()=>{
    console.log(item)
  },[])
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start pt-12 last:border-0">
      <div className="w-full md:w-[40%] shrink-0">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-gray-100">
          <Image
            src={item.thumbnailImageUrl || "/images/highlights/placeholder.jpg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-start text-start">
        <button
          onClick={onTitleClick}
          className="text-xl font-bold text-[#000000] mb-1 hover:text-[#116DB2] transition-colors text-left"
        >
          {item.name}
        </button>
        {/* Replaced slug with date as requested */}
        <p className="text-xs font-medium text-gray-400 mb-4">
          {item.publishedDate || ""}
        </p>
        <div className="w-12 h-[2px] bg-[#116DB2] mb-6"></div>
        <div className="space-y-4">
          <div
              className="prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: item.shortContent || "",
              }}
            />
        </div>
      </div>

      {/* Social Sidebar restored with exact design from commented code */}
      <div className="hidden lg:flex flex-col gap-1 pt-0">
        {[
          { id: "link", src: "/images/social/linkedin.png", alt: "linkedin" },
          { id: "in", src: "/images/social/insta.png", alt: "instagram" },
          { id: "x", src: "/images/social/x.png", alt: "x" },
          { id: "p", src: "/images/social/pinterest.png", alt: "pinterest" },
          { id: "f", src: "/images/social/facebook.png", alt: "facebook" },
        ].map((social) => (
          <a
            key={social.id}
            href="#"
            className="w-8 h-8 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors"
          >
            <Image
              src={social.src}
              alt={social.alt}
              width={33}
              height={33}
              className="object-contain p-1.5"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default function Highlights() {
  const [categories, setCategories] = useState<NewsCategorySummary[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<NewsCategoryDetailResponse | null>(null);
  const [selectedNewsItem, setSelectedNewsItem] =
    useState<NewsItemResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const cats = await highlightService.getCategories();
        setCategories(cats);
        if (cats.length > 0) {
          handleCategoryClick(cats[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  const handleCategoryClick = async (id: number) => {
    setLoading(true);
    setSelectedNewsItem(null);
    try {
      const detail = await highlightService.getCategoryById(id);
      setSelectedCategory(detail);
      console.log("api: ", detail)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsItemClick = async (id: number) => {
    setLoading(true);
    try {
      const item = await highlightService.getNewsItemById(id);
      setSelectedNewsItem(item);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatHtmlContent = (html: string) => {
    if (!html) return "";

    // This Regex finds all src="/images/..." and replaces them with src="https://localhost:49206/images/..."
    return html.replace(
        /src="\/images\//g, 
        `src="${process.env.NEXT_PUBLIC_BASE_IMG_URL}/images/`
    );
};

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbFour pages={["Highlights"]} carouselId={15} />
      <section className="apt-8 alg:py-20 py-8">
        <div className="2xl:max-w-[1500px] w-full mx-auto px-8">
          <div
            className={`flex flex-col ${selectedNewsItem ? "lg:flex-row gap-12" : ""}`}
          >
            <div className="flex-1">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  Loading...
                </div>
              ) : selectedNewsItem ? (
                <div className="animate-fadeIn">
                  <h1 className="text-4xl font-bold text-[#000000] py-8">
                    {selectedNewsItem.name}
                  </h1>
                  <div className="relative w-full h-[450px] mb-8">
                    <Image
                      src={
                        selectedNewsItem.thumbnailImageUrl ||
                        "/images/highlights/placeholder.jpg"
                      }
                      alt={selectedNewsItem.name}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="hidden lg:flex flex-col gap-1 pt-0">
                      {[
                        {
                          id: "link",
                          src: "/images/social/linkedin.png",
                          alt: "linkedin",
                        },
                        {
                          id: "in",
                          src: "/images/social/insta.png",
                          alt: "instagram",
                        },
                        { id: "x", src: "/images/social/x.png", alt: "x" },
                        {
                          id: "p",
                          src: "/images/social/pinterest.png",
                          alt: "pinterest",
                        },
                        {
                          id: "f",
                          src: "/images/social/facebook.png",
                          alt: "facebook",
                        },
                      ].map((social) => (
                        <a
                          key={social.id}
                          href="#"
                          className="w-8 h-8 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={social.src}
                            alt={social.alt}
                            width={33}
                            height={33}
                            className="object-contain p-1.5"
                          />
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-col  pl-4">
                      <p className="text-xs font-medium text-gray-400 mb-4 pt-1">
                        {selectedNewsItem.publishedDate}
                      </p>
                      <div className="w-18 h-[2px] bg-[#116DB2] mb-4"></div>
                      <div
                        className="prose prose-lg max-w-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: formatHtmlContent(selectedNewsItem.fullContent) || "",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {selectedCategory?.items.map((item) => (
                    <SingleHighlight
                      key={item.id}
                      item={item}
                      onTitleClick={() => handleNewsItemClick(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedNewsItem && (
              <div className="w-full lg:w-[300px] shrink-0 pt-24">
                <div className="sticky top-24">
                  <h3 className="text-lg text-[#000000] font-bold mb-6 pb-2">
                    Categories
                  </h3>
                  <ul className="space-y-4">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`text-sm font-medium transition-colors hover:text-[#116DB2] ${
                            selectedCategory?.id === cat.id
                              ? "text-[#116DB2] font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {cat.name} ({cat.newsItems.length})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
