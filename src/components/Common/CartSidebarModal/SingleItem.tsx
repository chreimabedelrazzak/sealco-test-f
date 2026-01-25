import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { apiClient } from "@/services/apiClient";

const SingleItem = ({ item, removeItemFromCart }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = async () => {
    const userToken = localStorage.getItem("userToken");
    const customerIdStr = localStorage.getItem("customerId");

    // 1. UI FIX: Ensure you are passing the ID that Redux uses to identify the row.
    // If your cart slice filters by 'id', and you've set 'id' to be the productId:
    dispatch(removeItemFromCart(item.id));

    if (userToken && customerIdStr) {
      const customerId = parseInt(customerIdStr, 10);
      try {
        // 2. SERVER SYNC: Use item.itemId (the primary key in your CartItems table)
        await apiClient.delete(
          `/customers/${customerId}/cart-items/${item.itemId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
      } catch (error) {
        console.error("Failed to remove item from server cart:", error);
        // Optional: Re-fetch or re-add if server fails
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] abg-gray-3 max-w-[90px] w-full h-22.5">
          <Image
            src={item.thumbnailImageUrl}
            unoptimized
            alt="product"
            width={100}
            height={100}
          />
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            <a href="#" className="text-lg font-bold text-[#000000]">
              {" "}
              {item.title}{" "}
            </a>
          </h3>
          <p className="text-custom-sm font-semibold text-[#000000]">
            Qty: {item.quantity}
          </p>
          <p className="text-custom-sm font-semibold text-[#000000]">
            {item.price}$ <span className="text-2xs">TTC</span>
          </p>
        </div>
      </div>

      <div className="flex w-full flex-row justify-end items-center border-t border-[#EEEEEE] py-4 px-2">
        <button>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

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
  );
};

export default SingleItem;
