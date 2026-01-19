"use client";
import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { orderService } from "@/services/orderService";
import { OrderDetailVm } from "@/types/order";

const Orders = () => {
  const [orders, setOrders] = useState<OrderDetailVm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userToken = localStorage.getItem("userToken");
      const customerId = localStorage.getItem("customerId");

      if (userToken && customerId) {
        try {
          setIsLoading(true);
          // Using the service function created previously
          const data = await orderService.getOrderHistory(customerId, userToken);
          setOrders(data);
        } catch (err: any) {
          console.error("Failed to fetch orders:", err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) return <p className="p-10">Loading your orders...</p>;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* Header Row */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
              <div className="min-w-[111px]"><p className="text-custom-sm text-dark">Order</p></div>
              <div className="min-w-[175px]"><p className="text-custom-sm text-dark">Date</p></div>
              <div className="min-w-[128px]"><p className="text-custom-sm text-dark">Status</p></div>
              <div className="min-w-[213px]"><p className="text-custom-sm text-dark">Items</p></div>
              <div className="min-w-[113px]"><p className="text-custom-sm text-dark">Total</p></div>
              {/* <div className="min-w-[113px]"><p className="text-custom-sm text-dark">Action</p></div> */}
            </div>
          )}

          {/* Desktop/Tablet View */}
          {orders.length > 0 ? (
            orders.map((orderItem) => (
              <SingleOrder key={orderItem.id} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">You don&apos;t have any orders!</p>
          )}
        </div>

        {/* Mobile View */}
        {orders.length > 0 &&
          orders.map((orderItem) => (
            <SingleOrder key={orderItem.id} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;