// "use client";
// import React, { useEffect, useState } from "react";
// import { Product } from "@/types/product";
// import { useModalContext } from "@/app/context/QuickViewModalContext";
// import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
// import { updateQuickView } from "@/redux/features/quickView-slice";
// import { addItemToCart } from "@/redux/features/cart-slice";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import Link from "next/link";
// import Image from "next/image";
// import { CategoryProduct } from "@/types/Category";
// import { cartService } from "@/services/cartService";
// import { wishListService } from "@/services/wishListService";
// import { useRouter } from "next/navigation";
// import { apiClient } from "@/services/apiClient";

// const SingleGridItem = ({ item }: { item: CategoryProduct }) => {
//   const { openModal } = useModalContext();
//   const { openCartModal } = useCartModalContext();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const [previewImg, setPreviewImg] = useState(0);
//   const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

//   const getImgUrl = (path: string) =>
//     `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${path}`;

//   const thumbnails = item.imgs?.thumbnails || [];
//   const fullSizeImages = item.imgs?.fullSize || [];
//   const totalImages = Math.max(thumbnails.length, 1);

//   const handleSetProductDetails = () => {
//     const productDetails = {
//       id: item.id,
//       productId: item.productId,
//       productName: item.productName,
//       title: item.productName,
//       thumbnailImageUrl: item.thumbnailImageUrl,
//       price: item.price,
//       oldPrice: item.oldPrice,
//       discountedPrice: item.price,
//       reviewsCount: item.reviewsCount || 0,

//       imgs: {
//         thumbnails: item.imgs?.thumbnails || [],
//         previews: item.imgs?.previews || [],
//         fullSize: item.imgs?.fullSize || [],
//       },

//       slug: item.slug,
//       description: item.description,
//       shortDescription: item.shortDescription,
//       stockQuantity: item.stockQuantity,
//       attributes: item.attributes || [],
//       categories: [], // ✅ ADDED: Fixes "Property 'categories' is missing"
//     };

//     localStorage.setItem("productDetails", JSON.stringify(productDetails));
//     dispatch(updateQuickView(productDetails));
//   };

//   const handleQuickViewUpdate = () => {
//     dispatch(
//       updateQuickView({
//         id: item.id,
//         productId: item.productId,
//         productName: item.productName,
//         title: item.productName, // Added to satisfy Product type
//         price: item.price,
//         oldPrice: item.oldPrice || 0,
//         discountedPrice: item.price,
//         reviewsCount: item.reviewsCount || 0,
//         thumbnailImageUrl: item.thumbnailImageUrl,
//         slug: item.slug,
//         description: item.description,
//         shortDescription: item.shortDescription || "", // Added
//         stockQuantity: item.stockQuantity, // Added
//         categories: [], // Added
//         attributes: item.attributes || [], // Added
//         imgs: {
//           thumbnails: [
//             `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`,
//           ],
//           previews: [
//             `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`,
//           ],
//           fullSize: [
//             `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`,
//           ], // ✅ ADDED: Fixes "Property 'fullSize' is missing"
//         },
//       }),
//     );
//   };

//   const handleAddToCart = async () => {
//     if (isOutOfStock) return;

//     // 1. Prepare standardized values
//     const cleanId = Number(item.id);
//     const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`;

//     // 2. Determine the Item ID (Default to product.id for guest/offline users)
//     let finalItemId = item.id;

//     const userToken = localStorage.getItem("userToken");
//     const customerIdStr = localStorage.getItem("customerId");

//     // 3. Server-Side Sync (Attempt to get real DB itemId if logged in)
//     if (userToken && customerIdStr) {
//       const customerId = parseInt(customerIdStr, 10);
//       try {
//         const apiPayload = {
//           productId: cleanId,
//           variationName: item.productName,
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
//       title: item.productName,
//       shortDescription: item.shortDescription,
//       itemId: finalItemId, // REAL DB ID if logged in, otherwise product.id
//       price: Number(item.price || item.oldPrice || 0),
//       discountedPrice: Number(item.price || 0),
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
//     const cleanProductId = Number(item.id);

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
//   const sizeAttr = item.attributes?.find((a) => a.attributeName === "Size");
//   const colorAttr = item.attributes?.find((a) => a.attributeName === "Color");
//   const isOutOfStock = item.stockQuantity <= 0;
//   const hasDiscount = item.oldPrice && item.oldPrice > item.price;
//   const discountPercent = hasDiscount
//     ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
//     : 0;

//   const stripHtml = (html) => {
//     const tmp = document.createElement("DIV");
//     tmp.innerHTML = html;
//     const text = tmp.textContent || tmp.innerText || "";

//     return text
//       .replace(/^\./, "") // Remove "." if it is the first character
//       .replace(/\./g, " "); // Replace all remaining "." with a space
//   };

//   return (
//     <div className="group w-full bg-white flex flex-col items-start text-start">
//       {/* Image Container with LG-style border and padding */}
//       <div className="relative w-full aspect-square flex items-center justify-center mb-4 border bga-[#F8F8F8] border-[#E8E8E8] p-8 overflow-hidden">
//         {/* TOP RIGHT ICONS: Wishlist and Share */}
//         <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
//           <div className="h-5">
//             {" "}
//             <p className="w-full text-center"></p>
//             {/* Fixed height prevent layout shift when text appears */}
//             {wishlistMessage && (
//               <p
//                 className={`text-sm font-medium animate-fade-in text-center ${
//                   wishlistMessage.includes("Added to wishlist!")
//                     ? "text-red"
//                     : "text-green-600"
//                 }`}
//               >
//                 {wishlistMessage}
//               </p>
//             )}
//           </div>
//           <button
//             onClick={handleAddToWishlist}
//             className="text-gray-400 hover:text-[#AD003A] transition-colors"
//             aria-label="Add to wishlist"
//           >
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//             </svg>
//           </button>
//           <button
//             className="text-gray-400 hover:text-black transition-colors"
//             aria-label="Share product"
//           >
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="18" cy="5" r="3"></circle>
//               <circle cx="6" cy="12" r="3"></circle>
//               <circle cx="18" cy="19" r="3"></circle>
//               <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
//               <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
//             </svg>
//           </button>
//         </div>

//         {isOutOfStock ? (
//           <span className="absolute top-12 right-0 bg-[#D32F2F] text-white text-[10px] font-bold py-1 px-3 z-10 uppercase tracking-tight">
//             Out of Stock
//           </span>
//         ) : (
//           discountPercent > 0 && (
//             <span className="absolute top-14 right-0 bg-[#116DB2] text-white text-[12px] font-bold py-1 px-3 z-10">
//               -{discountPercent}%
//             </span>
//           )
//         )}
//         {/* Product Image Container */}

//         {/* Product Image Container */}
//         <div className="relative w-full aspect-[4/5] overflow-hidden abg-[#f9f9f9]">
//           <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
//             <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110 flex items-center justify-center p-8">
//               <Image
//                 src={
//                   fullSizeImages[previewImg]
//                     ? getImgUrl(fullSizeImages[previewImg])
//                     : getImgUrl(item.thumbnailImageUrl)
//                 }
//                 alt={item.productName}
//                 fill
//                 sizes="(max-width: 768px) 100vw, 40vw"
//                 className="object-contain w-[80%] h-[80%]" // Centers the image automatically within the fill area
//               />
//             </div>

//             {/* <Image
//               src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`}
//               unoptimized
//               alt={item.productName}
//               fill
//               // Updated sizes to tell the browser we are using a larger portion of the viewport
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
//               className="object-contain p-2" // Reduced padding from p-4 to p-2
//             /> */}
//           </div>
//           {/* THUMBNAILS LIST AT BOTTOM OF CONTAINER */}
//           <div className="absolute bottom-4 left-0 w-full flex justify-center items-end gap-2 px-2 z-30">
//             {thumbnails.slice(0, 4).map((thumb, idx) => {
//               const isLastVisible = idx === 3;
//               const hasMore = thumbnails.length > 4;

//               return (
//                 <button
//                   key={idx}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation(); // Prevents clicking thumb from triggering link
//                     setPreviewImg(idx);
//                   }}
//                   className={`relative  border-2 bg-white/90 border-[#84858A] rounded-md overflow-hidden shadow-sm transition-all flex-shrink-0 
//             ${idx === previewImg ? " w-12 h-12 2xl:w-18 2xl:h-18" : "  hover:border-gray-400 w-10 h-10 2xl:w-12 2xl:h-12"}`}
//                 >
//                   <Image
//                     src={getImgUrl(thumb)}
//                     alt={`thumb-${idx}`}
//                     width={48}
//                     height={48}
//                     className="object-contain w-full h-full"
//                   />

//                   {isLastVisible && hasMore && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold pointer-events-none">
//                       +{thumbnails.length - 4}
//                     </div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Hover Actions (Quick View) */}
//         {/* <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//           <button
//             onClick={() => {
//               openModal();
//               handleQuickViewUpdate();
//             }}
//             className="bg-white text-black text-xs font-bold py-2 px-4 shadow-md uppercase tracking-wider hover:bg-[#116DB2] hover:text-white transition-colors"
//           >
//             Quick View
//           </button>
//         </div> */}
//       </div>

//       {/* Product Title */}
//       <h3 className="text-sm font-bold text-black mb-1 line-clamp-2 min-h-[70px] leading-tight">
//         <Link
//           href="/shop-details"
//           onClick={handleSetProductDetails}
//           className="hover:text-[#116DB2] transition-colors text-2xl font-bold text-[#000000]"
//         >
//           {stripHtml(item.shortDescription)}
//         </Link>
//       </h3>

//       {/* Meta Info - Fixed height container */}
//       <div className="mt-2 mb-8 h-[100px] flex flex-col justify-center gap-3">
//         {item.attributes &&
//           item.attributes
//             .filter(
//               (attr) =>
//                 attr.attributeName === "Size" || attr.attributeName === "Color",
//             )
//             .map((attr, index) => (
//               <div key={index} className="flex flex-col items-start gap-2">
//                 {/* Label */}
//                 <p className="text-[12px] text-[#000000] font-medium">
//                   {attr.attributeName === "Color" && `${attr.attributeName}:`}
//                 </p>

//                 {/* Value Display */}
//                 {attr.attributeName === "Size" ? (
//                   <div className="inline-flex items-center justify-center px-2 py-0.5 border border-gray-200 rounded-full min-w-[100px]">
//                     <span className="text-lg text-[#000000] font-semibold">
//                       {attr.value} L
//                     </span>
//                   </div>
//                 ) : (
//                   <div
//                     className="w-6 h-6 flex items-center justify-center rounded-md border border-[#E1E1E1] bg-white shadow-sm"
//                     title={attr.value}
//                   >
//                     <div
//                       className="w-4 h-4 rounded-[3px]"
//                       style={{ backgroundColor: attr.value }}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//       </div>

//       {/* Pricing section - Modified Logic */}
//       <div className="flex flex-col items-start mb-8 h-[40px] justify-center">
//         <div className="hover:text-[#116DB2] transition-colors text-[14px] font-bold text-[#696969]">
//           {item.productName}
//         </div>
//         <div className="flex items-center gap-2">
//           {/* Current Price */}
//           <span className="text-2xl font-bold text-[#000000]">
//             {item.price}$
//           </span>

//           {/* Old Price (Strikethrough) - only if higher than current */}
//           {hasDiscount && (
//             <span className="text-sm text-gray-400 line-through decoration-gray-400">
//               {item.oldPrice}$
//             </span>
//           )}

//           <span className="text-[14px] font-bold text-[#000000] uppercase translate-y-[2px]">
//             TTC
//           </span>
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="w-full grid grid-cols-1 gap-2">
//         <button
//           onClick={handleAddToCart}
//           disabled={isOutOfStock}
//           className={`w-full text-center font-bold text-white text-sm rounded-full py-3 px-10 transition-all duration-300 
//             ${
//               isOutOfStock
//                 ? "bg-gray-4 cursor-not-allowed"
//                 : "bg-[#116DB2] hover:bg-[#AD003A]"
//             }`}
//         >
//           {isOutOfStock ? "Out of Stock" : "Add to Cart"}
//         </button>
//         <Link
//           href="/contact"
//           className="w-full text-center font-bold text-[#000000] text-sm rounded-full bg-[#ffffff] border border-[#E2E2E2] py-3 px-10 hover:bg-[#AD003A] hover:text-[#ffffff] transition-all duration-300"
//         >
//           Where to Buy
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SingleGridItem;
"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { CategoryProduct } from "@/types/Category";
import { cartService } from "@/services/cartService";
import { wishListService } from "@/services/wishListService";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";

const SingleGridItem = ({ item }: { item: CategoryProduct }) => {
  const { openModal } = useModalContext();
  const { openCartModal } = useCartModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState(0);
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

  const getImgUrl = (path: string) =>
    `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${path}`;

  const thumbnails = item.imgs?.thumbnails || [];
  const fullSizeImages = item.imgs?.fullSize || [];
  const totalImages = Math.max(thumbnails.length, 1);

  const handleSetProductDetails = () => {
    const productDetails = {
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      title: item.productName,
      thumbnailImageUrl: item.thumbnailImageUrl,
      price: item.price,
      oldPrice: item.oldPrice,
      discountedPrice: item.price,
      reviewsCount: item.reviewsCount || 0,
      imgs: {
        thumbnails: item.imgs?.thumbnails || [],
        previews: item.imgs?.previews || [],
        fullSize: item.imgs?.fullSize || [],
      },
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription,
      stockQuantity: item.stockQuantity,
      attributes: item.attributes || [],
      categories: [], 
    };

    localStorage.setItem("productDetails", JSON.stringify(productDetails));
    dispatch(updateQuickView(productDetails));
  };

  const handleQuickViewUpdate = () => {
    dispatch(
      updateQuickView({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        title: item.productName,
        price: item.price,
        oldPrice: item.oldPrice || 0,
        discountedPrice: item.price,
        reviewsCount: item.reviewsCount || 0,
        thumbnailImageUrl: item.thumbnailImageUrl,
        slug: item.slug,
        description: item.description,
        shortDescription: item.shortDescription || "",
        stockQuantity: item.stockQuantity,
        categories: [],
        attributes: item.attributes || [],
        imgs: {
          thumbnails: [`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`],
          previews: [`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`],
          fullSize: [`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`],
        },
      }),
    );
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const cleanId = Number(item.id);
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.thumbnailImageUrl}`;
    let finalItemId = item.id;
    const userToken = localStorage.getItem("userToken");
    const customerIdStr = localStorage.getItem("customerId");

    if (userToken && customerIdStr) {
      const customerId = parseInt(customerIdStr, 10);
      try {
        const apiPayload = {
          productId: cleanId,
          variationName: item.productName,
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
        console.error("Error adding item to server-side cart:", err);
      }
    }

    const reduxPayload = {
      id: cleanId,
      title: item.productName,
      shortDescription: item.shortDescription,
      itemId: finalItemId,
      price: Number(item.price || item.oldPrice || 0),
      discountedPrice: Number(item.price || 0),
      quantity: 1,
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
    const cleanProductId = Number(item.id);
    try {
      await wishListService.addItemToWishlist(customerId, { productId: cleanProductId, quantity: 1 }, userToken);
      setWishlistMessage("Added to wishlist!");
      setTimeout(() => setWishlistMessage(null), 10000);
    } catch (err: any) {
      console.error("Failed to add to wishlist:", err.message);
    }
  };

  const isOutOfStock = item.stockQuantity <= 0;
  const hasDiscount = item.oldPrice && item.oldPrice > item.price;
  const discountPercent = hasDiscount ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;

  const stripHtml = (html) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.replace(/^\./, "").replace(/\./g, " ");
  };

  return (
    <div className="group w-full bg-white flex flex-col items-start text-start">
      {/* Container spacing reduced: mb-4 -> mb-3.5, p-8 -> p-7 */}
      <div className="relative w-full aspect-square flex items-center justify-center mb-3.5 border border-[#E8E8E8] p-7 overflow-hidden">
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
          <div className="h-4.5">
            {wishlistMessage && (
              <p className={`text-[12.6px] font-medium animate-fade-in text-center ${wishlistMessage.includes("Added to wishlist!") ? "text-red" : "text-green-600"}`}>
                {wishlistMessage}
              </p>
            )}
          </div>
          {/* Icons reduced: 20 -> 18, 18 -> 16 */}
          <button onClick={handleAddToWishlist} className="text-gray-400 hover:text-[#AD003A] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button className="text-gray-400 hover:text-black transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </div>

        {isOutOfStock ? (
          <span className="absolute top-10 right-0 bg-[#D32F2F] text-[9px] font-bold py-1 px-2.5 z-10 uppercase text-white">Out of Stock</span>
        ) : (
          discountPercent > 0 && (
            <span className="absolute top-12 right-0 bg-[#116DB2] text-white text-[10.8px] font-bold py-1 px-2.5 z-10">-{discountPercent}%</span>
          )
        )}

        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110 flex items-center justify-center p-7">
            <Image
              src={fullSizeImages[previewImg] ? getImgUrl(fullSizeImages[previewImg]) : getImgUrl(item.thumbnailImageUrl)}
              alt={item.productName}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-contain w-[80%] h-[80%]"
            />
          </div>
          {/* Thumbnails reduced: w-12/10 -> w-11/9 */}
          <div className="absolute bottom-3.5 left-0 w-full flex justify-center items-end gap-1.5 px-2 z-30">
            {thumbnails.slice(0, 4).map((thumb, idx) => {
              const isLastVisible = idx === 3;
              const hasMore = thumbnails.length > 4;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewImg(idx); }}
                  className={`relative border-2 bg-white/90 border-[#84858A] rounded-md overflow-hidden shadow-sm transition-all flex-shrink-0 
                    ${idx === previewImg ? " w-11 h-11 2xl:w-16 2xl:h-16" : " hover:border-gray-400 w-9 h-9 2xl:w-11 2xl:h-11"}`}
                >
                  <Image src={getImgUrl(thumb)} alt={`thumb-${idx}`} width={44} height={44} className="object-contain w-full h-full" />
                  {isLastVisible && hasMore && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] font-bold">+{thumbnails.length - 4}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Title font: text-2xl -> text-[21.6px], min-h-70 -> min-h-63 */}
      <h3 className="text-[12.6px] font-bold text-black mb-1 line-clamp-2 min-h-[58px] leading-tight">
        <Link href="/shop-details" onClick={handleSetProductDetails} className="hover:text-[#116DB2] transition-colors text-[21.6px] font-bold text-[#000000]">
          {stripHtml(item.shortDescription)}
        </Link>
      </h3>

      {/* Meta container: h-100 -> h-90, mb-8 -> mb-7 */}
      <div className="mt-1.5 mb-7 h-[90px] flex flex-col justify-center gap-2.5">
        {item.attributes?.filter((attr) => attr.attributeName === "Size" || attr.attributeName === "Color")
          .map((attr, index) => (
            <div key={index} className="flex flex-col items-start gap-1.5">
              <p className="text-[10.8px] text-[#000000] font-medium">{attr.attributeName === "Color" && `${attr.attributeName}:`}</p>
              {attr.attributeName === "Size" ? (
                <div className="inline-flex items-center justify-center px-2 py-0.5 border border-gray-200 rounded-full min-w-[90px]">
                  <span className="text-base text-[#000000] font-semibold">{attr.value} L</span>
                </div>
              ) : (
                <div className="w-5.5 h-5.5 flex items-center justify-center rounded-md border border-[#E1E1E1] bg-white shadow-sm" title={attr.value}>
                  <div className="w-3.5 h-3.5 rounded-[3px]" style={{ backgroundColor: attr.value }} />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Pricing: h-40 -> h-36, text-2xl -> text-[21.6px], mb-8 -> mb-7 */}
      <div className="flex flex-col items-start mb-7 h-[36px] justify-center">
        <div className="hover:text-[#116DB2] transition-colors text-[12.6px] font-bold text-[#696969]">{item.productName}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[21.6px] font-bold text-[#000000]">{item.price}$</span>
          {hasDiscount && <span className="text-[12.6px] text-gray-400 line-through">{item.oldPrice}$</span>}
          <span className="text-[12.6px] font-bold text-[#000000] uppercase translate-y-[2px]">TTC</span>
        </div>
      </div>

      {/* Buttons: py-3 -> py-2.5, text-sm -> text-[12.6px] */}
      <div className="w-full grid grid-cols-1 gap-1.5">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full text-center font-bold text-white text-[12.6px] rounded-full py-2.5 px-9 transition-all duration-300 ${isOutOfStock ? "bg-gray-4 cursor-not-allowed" : "bg-[#116DB2] hover:bg-[#AD003A]"}`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <Link href="/contact" className="w-full text-center font-bold text-[#000000] text-[12.6px] rounded-full bg-[#ffffff] border border-[#E2E2E2] py-2.5 px-9 hover:bg-[#AD003A] hover:text-[#ffffff] transition-all duration-300">
          Where to Buy
        </Link>
      </div>
    </div>
  );
};

export default SingleGridItem;