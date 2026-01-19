"use client";
import React, { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import { wishListService } from "@/services/wishListService";
import { WishListItemVm } from "@/types/WishList";

const Wishlist = () => {
  const [items, setItems] = useState<WishListItemVm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRemoveFromUI = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const userToken = localStorage.getItem("userToken");
      const customerId = localStorage.getItem("customerId");

      if (userToken && customerId) {
        try {
          setIsLoading(true);
          const data = await wishListService.getWishlistByUserId(
            customerId,
            userToken
          );
          setItems(data);
          console.log(data)
        } catch (err: any) {
          console.error("Failed to fetch wishlist:", err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (isLoading)
    return <p className="p-10 text-center">Loading your wishlist...</p>;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[770px] hidden md:block">
        {/* Header Row: Delete | Product | Stock | Action */}
        {/* Header Row */}
        {items.length > 0 && (
          <div className="flex items-center py-4 px-7.5 border-b border-stroke bg-gray-50">
            {/* Match Delete Button Width */}
            <div className="w-[60px]">
              <p className="text-custom-sm font-medium text-dark"></p>
            </div>

            {/* Match Product/Image Section */}
            <div className="flex-1">
              <p className="text-custom-sm font-medium text-dark">Product</p>
            </div>

            {/* Match Quantity Section */}
            <div className="w-[120px] text-center">
              <p className="text-custom-sm font-medium text-dark">Quantity</p>
            </div>

            {/* Match Add to Cart Section */}
            <div className="w-[150px] text-right">
              <p className="text-custom-sm font-medium text-dark">Action</p>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          items.map((item) => (
            <SingleItem key={item.id} orderItem={item} smallView={false} onRemove={handleRemoveFromUI} />
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg">Your wishlist is currently empty.</p>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {items.length > 0 ? (
          items.map((item) => (
            <SingleItem key={item.id} orderItem={item} smallView={true} onRemove={handleRemoveFromUI} />
          ))
        ) : (
          <p className="p-10 text-center">Empty wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
