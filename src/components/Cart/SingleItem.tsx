import React, { useState } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import { apiClient } from "@/services/apiClient";

import Image from "next/image";

const SingleItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = async () => {
    const userToken = localStorage.getItem("userToken");
    const customerIdStr = localStorage.getItem("customerId");
    console.log("Item: ", item.itemId);

    // 1. Always remove from Redux immediately (Optimistic Update)
    // This ensures the UI feels responsive even if the network is slow
    dispatch(removeItemFromCart(item.id));

    // 2. If signed in, sync the deletion with the server
    if (userToken && customerIdStr) {
      const customerId = parseInt(customerIdStr, 10);

      try {
        // Build the API call with the Bearer token
        await apiClient.delete(
          `/customers/${customerId}/cart-items/${item.itemId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        console.log(
          `Item ${item.id} successfully removed from server-side cart`,
        );
      } catch (error) {
        console.error("Failed to remove item from server cart:", error);
        // Optional: You could re-add the item to Redux here if the API fails
      }
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity - 1 }));
    } else {
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center  border-b border-gray-100 md:border-none gap-5 md:gap-0 relative">
        {/* COLUMN 1: PRODUCT INFO */}
        <div className="min-w-[420px] flex items-center gap-4">
          <div className="flex-shrink-0  w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
            <Image
              width={200}
              height={200}
              unoptimized
              src={item.thumbnailImageUrl}
              alt="product"
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[#000000] font-bold text-sm md:text-xl leading-snug hover:text-[#116DB2] transition-colors">
              <a href="#">{item.title}</a>
            </h3>
            {/* Mobile Only: Unit Price displayed under title */}
            <p className="text-gray-500 text-xs mt-1 md:hidden">
              Unit: {item.discountedPrice}$
            </p>
          </div>
        </div>

        {/* COLUMN 2: UNIT PRICE (Desktop Only) */}
        <div className="hidden md:block md:min-w-[150px] text-center">
          <p className="text-dark font-medium">{item.discountedPrice}$</p>
        </div>

        {/* COLUMN 3: QUANTITY SELECTOR */}
        <div className="w-full md:w-auto md:min-w-[200px] flex items-center justify-between md:justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase md:hidden">
            Quantity
          </span>
          
          <div className="flex items-center min-w-[350px] gap-1.5 h-11 bg-white ">
            {/* Minus Button */}
            <button
              onClick={handleDecreaseQuantity}
              className="w-11 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <span className="text-xl font-light leading-none">−</span>
            </button>

            {/* Quantity Display */}
            <div className="flex-1 max-w-[120px] h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center">
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-full text-center font-bold text-lg text-black outline-none bg-transparent"
              />
            </div>

            {/* Plus Button */}
            <button
              onClick={handleIncreaseQuantity}
              className="w-11 h-full border border-[#E2E2E2] rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <span className="text-xl font-light leading-none">+</span>
            </button>
          </div>
        </div>

        {/* COLUMN 4: SUBTOTAL */}
        <div className="w-full md:w-auto md:min-w-[150px] flex items-center justify-between md:justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase md:hidden">
            Subtotal
          </span>
          <p className="text-dark font-bold text-lg md:text-base">
            ${(item.discountedPrice * quantity).toFixed(2)}
          </p>
        </div>

        {/* COLUMN 5: REMOVE BUTTON */}
        <div className="absolute top-4 right-0 md:static md:min-w-[50px] flex justify-end">
          <button
            onClick={handleRemoveFromCart}
            aria-label="button for remove product from cart"
            className="flex items-center justify-center  max-w-[38px] w-full ha-9.5  text-dark ease-out duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 hover:stroke-red-light"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

     
    </>
  );
};

export default SingleItem;
