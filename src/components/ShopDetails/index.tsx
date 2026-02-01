// "use client";
// import React, { useEffect, useState } from "react";
// import BreadcrumbTwo from "../Common/BreadcrumbTwo";
// import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
// import Image from "next/image";
// import Newsletter from "../Common/Newsletter";
// import RecentlyViewdItems from "./RecentlyViewd";
// import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
// import { useAppSelector } from "@/redux/store";
// import ProductDetails from "./tabs/ProductDetails";
// import { cartService } from "@/services/cartService";
// import { apiClient } from "@/services/apiClient";
// import { addItemToCart } from "@/redux/features/cart-slice";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import FlixmediaLoader from "../FlixMediaLoader";
// import { wishListService } from "@/services/wishListService";
// import { useRouter } from "next/navigation";
// import { Link } from "lucide-react";

// const ShopDetails = () => {
//   const productFromStorage = useAppSelector(
//     (state) => state.productDetailsReducer.value,
//   );
//   const router = useRouter();
//   const { openCartModal } = useCartModalContext();
//   const [product, setProduct] = useState(productFromStorage);
//   const dispatch = useDispatch<AppDispatch>();
//   const { openPreviewModal } = usePreviewSlider();
//   const [previewImg, setPreviewImg] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("specs"); // Default to specs to match LG focus
//   const [isExpanded, setIsExpanded] = useState(false);
//   // Auto-select the first color found in the attributes list
//   const [selectedColor, setSelectedColor] = useState(
//     product.attributes?.filter((a) => a.attributeName === "Color")[0]?.value ||
//       null,
//   );
//   const isOutOfStock = product.stockQuantity <= 0;

//   const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

//   const handleNextImg = () => {
//     setPreviewImg((prev) => (prev + 1 === totalImages ? 0 : prev + 1));
//   };

//   const handlePrevImg = () => {
//     setPreviewImg((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
//   };

//   // Auto-select the first size found in the attributes list
//   const [selectedSize, setSelectedSize] = useState(
//     product.attributes?.filter((a) => a.attributeName === "Size")[0]?.value ||
//       null,
//   );

//   const handleAddToCart = async () => {
//     if (isOutOfStock) return;

//     // 1. Prepare standardized values
//     const cleanId = Number(product.id);
//     const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${product.thumbnailImageUrl}`;

//     // 2. Determine the Item ID (Default to product.id for guest/offline users)
//     let finalItemId = product.id;

//     const userToken = localStorage.getItem("userToken");
//     const customerIdStr = localStorage.getItem("customerId");

//     // 3. Server-Side Sync (Attempt to get real DB itemId if logged in)
//     if (userToken && customerIdStr) {
//       const customerId = parseInt(customerIdStr, 10);
//       try {
//         const apiPayload = {
//           productId: cleanId,
//           variationName: product.productName,
//           quantity: 1,
//         };

//         const response = await apiClient.post(
//           `/customers/${customerId}/add-cart-item`,
//           apiPayload,
//           {
//             headers: { Authorization: `Bearer ${userToken}` },
//           },
//         );

//         // ✅ Success: Update the itemId with the REAL primary key from your DB (e.g., 30086)
//         if (response.data && response.data.success) {
//           finalItemId = response.data.itemId;
//           console.log("Synced with server. DB ItemId:", finalItemId);
//         }
//       } catch (err) {
//         console.error(
//           "Error adding item to server-side cart, falling back to local ID:",
//           err,
//         );
//         // We keep finalItemId as item.id so the cart doesn't break
//       }
//     }

//     // 4. Prepare the Redux payload with the correct ID
//     const reduxPayload = {
//       id: cleanId, // Product ID for calculations
//       title: product.productName,
//       shortDescription: product.shortDescription,
//       itemId: finalItemId, // REAL DB ID if logged in, otherwise product.id
//       price: Number(product.price || product.oldPrice || 0),
//       discountedPrice: Number(product.price || 0),
//       quantity: 1,
//       thumbnailImageUrl: imageUrl,
//       imgs: {
//         thumbnails: [imageUrl],
//         previews: [imageUrl],
//       },
//     };

//     // 5. Update Redux and UI
//     dispatch(addItemToCart(reduxPayload));

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//     openCartModal();
//   };

//   const handleAddToWishlist = async () => {
//     // 1. Retrieve required data from storage
//     const userToken = localStorage.getItem("userToken");
//     const customerIdStr = localStorage.getItem("customerId");

//     // 2. Security/Validation check
//     if (!userToken || !customerIdStr) {
//       console.warn("User must be logged in to add items to the wishlist.");
//       router.push("/signin");
//       return;
//     }

//     const customerId = parseInt(customerIdStr, 10);
//     const cleanProductId = Number(product.id);

//     try {
//       // 3. Use the specific API service function
//       const result = await wishListService.addItemToWishlist(
//         customerId,
//         {
//           productId: cleanProductId,
//           quantity: 1, // Default quantity for wishlist items
//         },
//         userToken,
//       );

//       // 4. Success feedback
//       console.log("Success:", result.message);
//       // Optional: Add a toast notification here
//       setWishlistMessage("Added to wishlist!");

//       // ✅ Clear message after 3 seconds
//       setTimeout(() => {
//         setWishlistMessage(null);
//       }, 10000);
//     } catch (err: any) {
//       // Error is already logged in the service, but you can handle UI feedback here
//       console.error("Failed to add to wishlist:", err.message);
//     }
//   };

//   useEffect(() => {
//     const alreadyExist = localStorage.getItem("productDetails");

//     if (alreadyExist) {
//       const parsedProduct = JSON.parse(alreadyExist);
//       setProduct(parsedProduct);

//       // 1. Extract first values
//       const firstColor = parsedProduct.attributes?.find(
//         (a) => a.attributeName === "Color",
//       )?.value;

//       const firstSize = parsedProduct.attributes?.find(
//         (a) => a.attributeName === "Size",
//       )?.value;

//       // 2. Auto-select only if they exist
//       if (firstColor) setSelectedColor(firstColor);
//       if (firstSize) setSelectedSize(firstSize);
//     } else {
//       // 3. Fallback: If no localStorage, ensure they are null
//       setSelectedColor(null);
//       setSelectedSize(null);
//     }
//   }, []); // Runs exactly once on mount

//   // Helper to get the correct image URL
//   const getImgUrl = (path: string) => {
//     if (!path)
//       return `${process.env.NEXT_PUBLIC_BASE_URL}/user-content/no-image.png`;
//     // If the path is already an absolute URL, return it, else prepend base
//     return path.startsWith("http")
//       ? path
//       : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${path}`;
//   };

//   const totalImages = product.imgs?.thumbnails.length || 0;
//   const displayLimit = 8;
//   const productEAN =
//     product.attributes
//       ?.find((a) =>
//         ["EAN", "BARCODE"].includes(a.attributeName.trim().toUpperCase()),
//       )
//       ?.value?.replace(/\D/g, "") || "00004703198411";

//   const productBrand =
//     product.attributes?.find(
//       (a) => a.attributeName.trim().toUpperCase() === "BRAND",
//     )?.value || "LG";

//   if (!product)
//     return <div className="py-20 text-center">Loading product...</div>;

//   const stripHtml = (html) => {
//     const tmp = document.createElement("DIV");
//     tmp.innerHTML = html;
//     const text = tmp.textContent || tmp.innerText || "";

//     return text
//       .replace(/^\./, "") // Remove "." if it is the first character
//       .replace(/\./g, " "); // Replace all remaining "." with a space
//   };

//   const stripHtmlDescription = (html) => {
//     return html
//       .replace(/^\./, "") // Remove "." if it is the first character
//       .replace(/\./g, " "); // Replace all remaining "." with a space
//   };

//   return (
//     <>
//       <BreadcrumbTwo title={"Shop Details"} pages={[`${product.title}`]} />

//       <section className="overflow-hidden relative pb-20 pt-10 lg:pt-16 bg-white">
//         <div className="max-w-[1200px] 2xl:max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
//           {/* HEADER UTILITY ICONS: Moved to top right of content grid */}
//           <div className="flex justify-end items-center gap-4 mb-6">
//             <span className="text-sm font-bold text-gray-800">(0)</span>
//             <button className="text-gray-400 hover:text-black transition-colors">
//               <svg
//                 width="22"
//                 height="22"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//               >
//                 <circle cx="18" cy="5" r="3"></circle>
//                 <circle cx="6" cy="12" r="3"></circle>
//                 <circle cx="18" cy="19" r="3"></circle>
//                 <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
//                 <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
//               </svg>
//             </button>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-10 xl:gap-20">
//             {/* LEFT SIDE: Image Gallery */}
//             <div className="lg:w-[55%] w-full">
//               <div className="relative aspect-square border border-[#EEEEEE] abg-[#FDFDFD] flex items-center justify-center ap-10 overflow-hidden group">
//                 {/* Previous Arrow */}
//                 {totalImages > 1 && (
//                   <button
//                     onClick={handlePrevImg}
//                     className="absolute left-4 z-10 p-2 rounded-full bg-white/80 shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
//                     aria-label="Previous image"
//                   >
//                     <svg
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="15 18 9 12 15 6"></polyline>
//                     </svg>
//                   </button>
//                 )}

//                 <Image
//                   src={getImgUrl(
//                     (product.imgs?.fullSize &&
//                       product.imgs.fullSize[previewImg]) ||
//                       product.thumbnailImageUrl,
//                   )}
//                   alt={product.productName}
//                   width={1000}
//                   height={1000}
//                   priority
//                   className="object-contain transition-transform duration-500 group-hover:scale-105"
//                 />

//                 {/* Next Arrow */}
//                 {totalImages > 1 && (
//                   <button
//                     onClick={handleNextImg}
//                     className="absolute right-4 z-10 p-2 rounded-full bg-white/80 shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
//                     aria-label="Next image"
//                   >
//                     <svg
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="9 18 15 12 9 6"></polyline>
//                     </svg>
//                   </button>
//                 )}

//                 {/* Image Counter Badge (Optional but helpful) */}
//                 <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                   {previewImg + 1} / {totalImages}
//                 </div>
//               </div>

//               {/* THUMBNAILS LIST */}
//               <div
//                 className={`flex gap-4 mt-6 pb-2 transition-all duration-500 ${
//                   isExpanded
//                     ? "flex-wrap justify-start"
//                     : "overflow-x-auto scrollbar-hide"
//                 }`}
//               >
//                 {(isExpanded
//                   ? product.imgs?.thumbnails
//                   : product.imgs?.thumbnails.slice(0, 4)
//                 ).map((item: string, key: number) => (
//                   <button
//                     key={key}
//                     onClick={() => setPreviewImg(key)}
//                     className={`relative w-[100px] h-[100px] border-2 transition-all p-1 bg-white flex-shrink-0 
//         ${key === previewImg ? "border-[#116DB2]" : "border-[#EEEEEE] hover:border-gray-300"}`}
//                   >
//                     <Image
//                       width={80}
//                       height={80}
//                       src={getImgUrl(item)}
//                       alt={`thumb-${key}`}
//                       className="w-full h-full object-contain"
//                     />
//                   </button>
//                 ))}

//                 {/* Show the "+ more" box as a 6th box only when NOT expanded */}
//                 {!isExpanded && totalImages > 5 && (
//                   <button
//                     onClick={() => setIsExpanded(true)}
//                     className="relative w-[100px] h-[100px] border-2 border-[#EEEEEE] transition-all p-1 bg-gray-50 flex-shrink-0 flex items-center justify-center hover:border-gray-300"
//                   >
//                     {/* Background: optional tiny preview of the next image */}
//                     <div className="relative z-10 text-[#116DB2] text-xs font-bold text-center">
//                       +{totalImages - 5} <br /> more
//                     </div>
//                   </button>
//                 )}
//               </div>

//               {/* Optional: Add a "Show Less" button if expanded */}
              // {isExpanded && (
              //   <button
              //     onClick={() => setIsExpanded(false)}
              //     className="mt-2 text-[#116DB2] text-xs font-bold hover:underline"
              //   >
              //     Show Less
              //   </button>
//               )}
//             </div>

//             {/* RIGHT SIDE: Content */}
//             <div className="lg:w-[45%] w-full flex flex-col">
//               <span className="text-sm font-bold text-gray-400 uppercase tracking-tight mb-1">
//                 <div className="product-description-container text-xl lg:text-lg text-black leading-relaxed font-medium">
//                   {product.title}
//                 </div>
//               </span>
//               <span className="text-sm font-bold text-gray-400 tracking-tight mb-1">
//                 {/* <div
//                   className="product-description-container text-base lg:text-2xl text-[#333333] leading-relaxed font-bold"
//                   dangerouslySetInnerHTML={{ __html: product.shortDescription }}
//                 /> */}
//                 <div className="product-description-container text-base lg:text-3xl text-[#333333] leading-relaxed font-bold">
//                   {stripHtml(product.shortDescription)}
//                 </div>
//               </span>
//               <div className="flex items-center gap-4 border-b border-[#EEEEEE] py-4">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className="w-4 h-4 fill-white stroke-[#D2D2D2]"
//                       viewBox="0 0 20 20"
//                       strokeWidth={1.5}
//                     >
//                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                     </svg>
//                   ))}
//                   <span className="text-sm text-gray-500 ml-1 border-r pr-4 border-[#EEEEEE] font-bold">
//                     (0)
//                   </span>
//                 </div>
//                 <button className="text-[#116DB2] text-sm font-bold pb-0.5">
//                   Write a review
//                 </button>
//               </div>
//               <h3 className="font-bold text-2xl pt-4">Key Features</h3>
//               <h1 className="text-2xl lg:text-3xl font-bold text-[#000000] mb-4 leading-tight border-b border-[#EEEEEE] py-4">
//                 <div
//                   className="product-description-container text-base lg:text-md text-[#5D5D5D] leading-relaxed"
//                   dangerouslySetInnerHTML={{
//                     __html: stripHtmlDescription(product.description),
//                   }}
//                 />
//               </h1>

//               {/* Key Features */}
//               {/* <div className="border-t border-[#EEEEEE] py-6 relative">
//                 <h3 className="font-bold text-lg mb-4">Key Features</h3>
//                 <button className="absolute right-0 top-6 text-xl font-light text-gray-400">
//                   −
//                 </button>
//                 <ul className="space-y-3 text-gray-600 text-sm font-medium">
//                   <li>InstaView Door-in-Door™</li>
//                   <li>Hygiene FRESH+™</li>
//                   <li>Linear compressor</li>
//                   <li>Smart storage system</li>
//                 </ul>
//               </div> */}

//               {/* 1. DYNAMIC COLOR SELECTOR */}
//               {product.attributes?.some((a) => a.attributeName === "Color") && (
//                 <div className="border-b border-[#EEEEEE] py-4 relative">
//                   <h3 className="font-bold text-2xl mb-2">Choose your color</h3>
//                   <p className="text-xs font-bold text-[#000000] mb-3 tracking-tight">
//                     Color: {selectedColor || "None"}
//                   </p>
//                   <div className="flex gap-3">
//                     {product.attributes
//                       .filter((a) => a.attributeName === "Color")
//                       .map((color, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedColor(color.value)}
//                           className={`w-8 h-8 p-0.5 transition-all ${
//                             selectedColor === color.value
//                               ? "border-gray-800 scale-110"
//                               : "border-transparent"
//                           }`}
//                           title={color.value}
//                         >
//                           <div
//                             className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E1E1E1] bg-white shadow-sm"
//                             title={color.value}
//                           >
//                             <div
//                               className="w-6 h-6 rounded-[3px]"
//                               style={{ backgroundColor: color.value }}
//                             />
//                           </div>
//                         </button>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               {/* 2. DYNAMIC SIZE / WEIGHT SELECTOR */}
//               {product.attributes?.some((a) => a.attributeName === "Size") && (
//                 <div className="border-b border-[#EEEEEE] py-4 relative">
//                   <h3 className="font-bold text-2xl mb-4">
//                     Choose your Weight
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {product.attributes
//                       .filter((a) => a.attributeName === "Size")
//                       .map((size, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedSize(size.value)}
//                           className={`px-6 py-2 rounded-full border font-bold text-sm transition-all ${
//                             selectedSize === size.value
//                               ? "bg-white border-gray-900 text-gray-900 shadow-sm"
//                               : "bg-gray-50 border-transparent text-gray-400 hover:border-gray-200"
//                           }`}
//                         >
//                           {size.value} L
//                         </button>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               {/* PRICE */}
//               <div className="flex items-baseline gap-3 mb-8 pt-6">
//                 {/* Current Price - Large Bold */}
//                 <span className="text-4xl font-bold text-[#000000]">
//                   {product.price}$
//                 </span>

//                 {/* Old Price - Only if discount exists */}
//                 {product.oldPrice && product.oldPrice > product.price && (
//                   <span className="text-lg text-gray-400 line-through decoration-gray-400">
//                     {product.oldPrice}$
//                   </span>
//                 )}

//                 {/* Tax Label */}
//                 <span className="text-lg font-bold text-[#000000] uppercase">
//                   TTC
//                 </span>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex flex-col gap-3">
//                 <div className="flex gap-4 items-center">
//                   {/* QUANTITY COUNTER (Rectangle Design) */}
//                   <div className="flex items-center gap-1.5 h-11 bg-white">
//                     {/* Minus Button */}
//                     <button
//                       onClick={() => quantity > 1 && setQuantity(quantity - 1)}
//                       className="w-11 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-colors"
//                     >
//                       <span className="text-xl font-light leading-none">−</span>
//                     </button>

//                     {/* Quantity Display */}
//                     <div className="flex-1 min-w-[120px] h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center">
//                       <input
//                         type="text"
//                         readOnly
//                         value={quantity}
//                         className="w-full text-center font-bold text-lg text-black outline-none bg-transparent"
//                       />
//                     </div>

//                     {/* Plus Button */}
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="w-11 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-colors"
//                     >
//                       <span className="text-xl font-light leading-none">+</span>
//                     </button>
//                   </div>
//                   <button
//                     onClick={handleAddToCart}
//                     disabled={
//                       (!selectedColor &&
//                         product.attributes?.some(
//                           (a) => a.attributeName === "Color",
//                         )) ||
//                       (!selectedSize &&
//                         product.attributes?.some(
//                           (a) => a.attributeName === "Size",
//                         ))
//                     }
//                     className={`w-full text-center font-bold text-sm rounded-full py-3 px-10 transition-all duration-300 ${
//                       (!selectedColor &&
//                         product.attributes?.some(
//                           (a) => a.attributeName === "Color",
//                         )) ||
//                       (!selectedSize &&
//                         product.attributes?.some(
//                           (a) => a.attributeName === "Size",
//                         ))
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : "bg-[#116DB2] text-white hover:bg-[#AD003A]"
//                     }`}
//                   >
//                     {(!selectedColor &&
//                       product.attributes?.some(
//                         (a) => a.attributeName === "Color",
//                       )) ||
//                     (!selectedSize &&
//                       product.attributes?.some(
//                         (a) => a.attributeName === "Size",
//                       ))
//                       ? "Select Options First"
//                       : "Add To Cart"}
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => router.push("/contact")}
//                   className="w-full text-center font-bold text-sm rounded-full 
//                   bg-white text-gray-800 border border-gray-300
//                   py-3 px-10
//                   hover:bg-[#116DB2] hover:text-white hover:border-[#116DB2]
//                   transition-all duration-300"
//                 >
//                   Where To Buy
//                 </button>
//                 <button
//                   onClick={handleAddToWishlist}
//                   className="w-full text-center font-bold text-sm rounded-full 
//                   bg-white text-gray-800 border border-gray-300
//                   py-3 px-10
//                   hover:bg-[#AD003A] hover:text-white hover:border-[#AD003A]
//                   transition-all duration-300 flex items-center justify-center gap-2 mt-2 uppercase"
//                 >
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="text-[#333333]"
//                   >
//                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                   </svg>
//                   Add to Wishlist
//                 </button>
//                 <div className="h-5">
//                   {" "}
//                   <p className="w-full text-center"></p>
//                   {/* Fixed height prevent layout shift when text appears */}
//                   {wishlistMessage && (
//                     <p
//                       className={`text-sm font-medium animate-fade-in text-center ${
//                         wishlistMessage.includes("Added to wishlist!")
//                           ? "text-red"
//                           : "text-green-600"
//                       }`}
//                     >
//                       {wishlistMessage}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="max-w-[1400px] mx-auto w-full px-4">
//         {/* Using hardcoded static values from the working LG C4 example */}
//         <FlixmediaLoader brand="LG" mpn={product.title} ean="" />
//       </div>

//       {/* <ProductDetails /> */}

//       {/* <RecentlyViewdItems />
//       <Newsletter /> */}
//     </>
//   );
// };

// export default ShopDetails;
"use client";
import React, { useEffect, useState } from "react";
import BreadcrumbTwo from "../Common/BreadcrumbTwo";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "./RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";
import ProductDetails from "./tabs/ProductDetails";
import { cartService } from "@/services/cartService";
import { apiClient } from "@/services/apiClient";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import FlixmediaLoader from "../FlixMediaLoader";
import { wishListService } from "@/services/wishListService";
import { useRouter } from "next/navigation";

const ShopDetails = () => {
  const productFromStorage = useAppSelector(
    (state) => state.productDetailsReducer.value,
  );
  const router = useRouter();
  const { openCartModal } = useCartModalContext();
  const [product, setProduct] = useState(productFromStorage);
  const dispatch = useDispatch<AppDispatch>();
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState(
    product.attributes?.filter((a) => a.attributeName === "Color")[0]?.value || null,
  );
  const isOutOfStock = product.stockQuantity <= 0;
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

  const handleNextImg = () => {
    setPreviewImg((prev) => (prev + 1 === totalImages ? 0 : prev + 1));
  };

  const handlePrevImg = () => {
    setPreviewImg((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const [selectedSize, setSelectedSize] = useState(
    product.attributes?.filter((a) => a.attributeName === "Size")[0]?.value || null,
  );

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const cleanId = Number(product.id);
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${product.thumbnailImageUrl}`;
    let finalItemId = product.id;
    const userToken = localStorage.getItem("userToken");
    const customerIdStr = localStorage.getItem("customerId");

    if (userToken && customerIdStr) {
      const customerId = parseInt(customerIdStr, 10);
      try {
        const apiPayload = {
          productId: cleanId,
          variationName: product.productName,
          quantity: 1,
        };
        const response = await apiClient.post(
          `/customers/${customerId}/add-cart-item`,
          apiPayload,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        if (response.data && response.data.success) {
          finalItemId = response.data.itemId;
        }
      } catch (err) {
        console.error("Error adding item to cart:", err);
      }
    }

    const reduxPayload = {
      id: cleanId,
      title: product.productName,
      shortDescription: product.shortDescription,
      itemId: finalItemId,
      price: Number(product.price || product.oldPrice || 0),
      discountedPrice: Number(product.price || 0),
      quantity: quantity,
      thumbnailImageUrl: imageUrl,
      imgs: { thumbnails: [imageUrl], previews: [imageUrl] },
    };

    dispatch(addItemToCart(reduxPayload));
    window.scrollTo({ top: 0, behavior: "smooth" });
    openCartModal();
  };

  const handleAddToWishlist = async () => {
    const userToken = localStorage.getItem("userToken");
    const customerIdStr = localStorage.getItem("customerId");
    if (!userToken || !customerIdStr) {
      router.push("/signin");
      return;
    }
    const customerId = parseInt(customerIdStr, 10);
    const cleanProductId = Number(product.id);
    try {
      await wishListService.addItemToWishlist(customerId, { productId: cleanProductId, quantity: 1 }, userToken);
      setWishlistMessage("Added to wishlist!");
      setTimeout(() => setWishlistMessage(null), 10000);
    } catch (err: any) {
      console.error("Failed to add to wishlist:", err.message);
    }
  };

  useEffect(() => {
    const alreadyExist = localStorage.getItem("productDetails");
    if (alreadyExist) {
      const parsedProduct = JSON.parse(alreadyExist);
      setProduct(parsedProduct);
      const firstColor = parsedProduct.attributes?.find((a) => a.attributeName === "Color")?.value;
      const firstSize = parsedProduct.attributes?.find((a) => a.attributeName === "Size")?.value;
      if (firstColor) setSelectedColor(firstColor);
      if (firstSize) setSelectedSize(firstSize);
    }
  }, []);

  const getImgUrl = (path: string) => {
    if (!path) return `${process.env.NEXT_PUBLIC_BASE_URL}/user-content/no-image.png`;
    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${path}`;
  };

  const totalImages = product.imgs?.thumbnails.length || 0;
  
  const stripHtml = (html) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").replace(/^\./, "").replace(/\./g, " ");
  };

  return (
    <>
      <BreadcrumbTwo title={"Shop Details"} pages={[`${product.title}`]} />

      {/* Reduced pb-20 -> pb-18, pt-10 -> pt-9 */}
      <section className="overflow-hidden relative pb-18 pta-9 lg:pt-14 bg-white">
        {/* max-width reduced 1400 -> 1260, 1200 -> 1080 */}
        <div className=" z:max-w-[1500px] w-full mx-auto px-8">
          {/* mb-6 -> mb-5 */}
          

          {/* gap-10 -> gap-9, gap-20 -> gap-18 */}
          <div className="flex flex-col lg:flex-row gap-9 xl:gap-18">
            {/* LEFT SIDE: Image Gallery */}
            <div className="lg:w-[55%] w-full">
              <div className="relative aspect-square border border-[#EEEEEE] flex items-center justify-center overflow-hidden group">
                {totalImages > 1 && (
                  <button onClick={handlePrevImg} className="absolute left-3.5 z-10 p-1.5 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                )}

                <Image
                  src={getImgUrl((product.imgs?.fullSize && product.imgs.fullSize[previewImg]) || product.thumbnailImageUrl)}
                  alt={product.productName}
                  width={900}
                  height={900}
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {totalImages > 1 && (
                  <button onClick={handleNextImg} className="absolute right-3.5 z-10 p-1.5 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                )}

                <div className="absolute bottom-3.5 right-3.5 bg-black/50 text-white text-[10.8px] px-2 py-0.5 rounded">
                  {previewImg + 1} / {totalImages}
                </div>
              </div>

              {/* THUMBNAILS: 100px -> 90px, mt-6 -> mt-5.5 */}
              <div className={`flex gap-3.5 mt-5.5 pb-1.5 transition-all duration-500 ${isExpanded ? "flex-wrap justify-start" : "overflow-x-auto scrollbar-hide"}`}>
                {(isExpanded ? product.imgs?.thumbnails : product.imgs?.thumbnails.slice(0, 4)).map((item: string, key: number) => (
                  <button
                    key={key}
                    onClick={() => setPreviewImg(key)}
                    className={`relative w-[90px] h-[90px] border-2 transition-all p-1 bg-white flex-shrink-0 ${key === previewImg ? "border-[#116DB2]" : "border-[#EEEEEE] hover:border-gray-300"}`}
                  >
                    <Image width={72} height={72} src={getImgUrl(item)} alt={`thumb-${key}`} className="w-full h-full object-contain" />
                  </button>
                ))}

                {!isExpanded && totalImages > 5 && (
                  <button onClick={() => setIsExpanded(true)} className="relative w-[90px] h-[90px] border-2 border-[#EEEEEE] p-1 bg-gray-50 flex-shrink-0 flex items-center justify-center">
                    <div className="relative z-10 text-[#116DB2] text-[10.8px] font-bold text-center">+{totalImages - 5} <br /> more</div>
                  </button>
                )}

                {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-2 text-[#116DB2] text-xs font-bold hover:underline"
                >
                  Show Less
                </button>)}
              </div>
            </div>

            {/* RIGHT SIDE: Content */}
            <div className="lg:w-[45%] w-full flex flex-col">
              <div className="flex justify-end items-center gap-3.5 mb-5">
            <span className="text-[12.6px] font-bold text-gray-800">(0)</span>
            <button className="text-gray-400 hover:text-black transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
              <div className="text-[16.2px] lg:text-[14.4px] text-black leading-relaxed font-medium mb-1">
                {product.title}
              </div>
              <div className="text-[14.4px] lg:text-[27px] text-[#333333] leading-relaxed font-bold mb-1">
                {stripHtml(product.shortDescription)}
              </div>

              {/* gap-4 -> gap-3.5, py-4 -> py-3.5 */}
              <div className="flex items-center gap-3.5 border-b border-[#EEEEEE] py-3.5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-white stroke-[#D2D2D2]" viewBox="0 0 20 20" strokeWidth={1.5}>
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-[12.6px] text-gray-500 ml-1 border-r pr-3.5 border-[#EEEEEE] font-bold">(0)</span>
                </div>
                <button className="text-[#116DB2] text-[12.6px] font-bold">Write a review</button>
              </div>

              <h3 className="font-bold text-[21.6px] pt-3.5">Key Features</h3>
              <div className="text-[14.4px] lg:text-[15.3px] text-[#5D5D5D] leading-relaxed border-b border-[#EEEEEE] py-3.5 mb-3.5"
                dangerouslySetInnerHTML={{ __html: stripHtml(product.description) }}
              />

              {/* COLOR SELECTOR: w-8 -> w-7.2, text-2xl -> text-[21.6px] */}
              {product.attributes?.some((a) => a.attributeName === "Color") && (
                <div className="border-b border-[#EEEEEE] py-3.5">
                  <h3 className="font-bold text-[21.6px] mb-2">Choose your color</h3>
                  <p className="text-[10.8px] font-bold text-[#000000] mb-2.5">Color: {selectedColor || "None"}</p>
                  <div className="flex gap-2.5">
                    {product.attributes.filter((a) => a.attributeName === "Color").map((color, index) => (
                      <button key={index} onClick={() => setSelectedColor(color.value)} className={`w-7.2 h-7.2 p-0.5 transition-all ${selectedColor === color.value ? "border-gray-800 scale-105" : "border-transparent"}`}>
                        <div className="w-7.2 h-7.2 flex items-center justify-center rounded-md border border-[#E1E1E1] bg-white shadow-sm">
                          <div className="w-5.5 h-5.5 rounded-[3px]" style={{ backgroundColor: color.value }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZE SELECTOR: px-6 -> px-5.4, text-sm -> text-[12.6px] */}
              {product.attributes?.some((a) => a.attributeName === "Size") && (
                <div className="border-b border-[#EEEEEE] py-3.5">
                  <h3 className="font-bold text-[21.6px] mb-3.5">Choose your Weight</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.attributes.filter((a) => a.attributeName === "Size").map((size, index) => (
                      <button key={index} onClick={() => setSelectedSize(size.value)}
                        className={`px-6 py-1.5 rounded-full border font-bold text-[12.6px] transition-all ${selectedSize === size.value ? "bg-white border-gray-900 text-gray-900" : "bg-gray-50 border-transparent text-gray-400"}`}>
                        {size.value} L
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PRICE: text-4xl -> text-[32.4px], mb-8 -> mb-7 */}
              <div className="flex items-baseline gap-2.5 mb-7 pt-5.5">
                <span className="text-[32.4px] font-bold text-[#000000]">{product.price}$</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-[16.2px] text-gray-400 line-through">{product.oldPrice}$</span>
                )}
                <span className="text-[16.2px] font-bold text-[#000000] uppercase">TTC</span>
              </div>

              {/* ACTIONS: py-3 -> py-2.5, px-10 -> px-9, h-11 -> h-10 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-3.5 items-center">
                  <div className="flex items-center gap-1.5 h-10 bg-white">
                    <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-10 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400">
                      <span className="text-lg font-light leading-none">−</span>
                    </button>
                    <div className="flex-1 min-w-[108px] h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center">
                      <input type="text" readOnly value={quantity} className="w-full text-center font-bold text-base text-black bg-transparent outline-none" />
                    </div>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400">
                      <span className="text-lg font-light leading-none">+</span>
                    </button>
                  </div>
                  <button onClick={handleAddToCart}
                    disabled={(!selectedColor && product.attributes?.some(a => a.attributeName === "Color")) || (!selectedSize && product.attributes?.some(a => a.attributeName === "Size"))}
                    className={`w-full text-center font-bold text-[12.6px] rounded-full py-2.5 px-9 transition-all duration-300 ${(!selectedColor && product.attributes?.some(a => a.attributeName === "Color")) || (!selectedSize && product.attributes?.some(a => a.attributeName === "Size")) ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-[#116DB2] text-white hover:bg-[#AD003A]"}`}>
                    {(!selectedColor && product.attributes?.some(a => a.attributeName === "Color")) || (!selectedSize && product.attributes?.some(a => a.attributeName === "Size")) ? "Select Options First" : "Add To Cart"}
                  </button>
                </div>
                <button onClick={() => router.push("/contact")} className="w-full text-center font-bold text-[12.6px] rounded-full bg-white text-gray-800 border border-gray-300 py-2.5 px-9 hover:bg-[#116DB2] hover:text-white transition-all duration-300">
                  Where To Buy
                </button>
                <button onClick={handleAddToWishlist} className="w-full text-center font-bold text-[12.6px] rounded-full bg-white text-gray-800 border border-gray-300 py-2.5 px-9 hover:bg-[#AD003A] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mt-1.5 uppercase">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#333333]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  Add to Wishlist
                </button>
                <div className="h-4.5">
                  {wishlistMessage && (
                    <p className={`text-[12.6px] font-medium animate-fade-in text-center ${wishlistMessage.includes("Added to wishlist!") ? "text-red" : "text-green-600"}`}>
                      {wishlistMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="max-w-[1400px] mx-auto w-full px-8">
        <FlixmediaLoader brand="LG" mpn={product.title} ean="" />
      </div>
    </>
  );
};

export default ShopDetails;