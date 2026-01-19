"use client";
import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { OrderDetailVm } from "@/types/order";

const SingleOrder = ({ orderItem, smallView }: { orderItem: OrderDetailVm; smallView: boolean }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);
  const toggleEdit = () => setShowEdit(!showEdit);
  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  // Helper to determine status color
  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("new") || s.includes("processing")) return "text-yellow bg-yellow-light-4";
    if (s.includes("complete") || s.includes("delivered")) return "text-green bg-green-light-6";
    return "text-red bg-red-light-6";
  };

  // Extract a title/summary from the first order item
  const orderTitle = orderItem.orderItems.length > 0 
    ? orderItem.orderItems[0].productName + (orderItem.orderItems.length > 1 ? ` (+${orderItem.orderItems.length - 1} more)` : "")
    : "No Items";

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">#{orderItem.id}</p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">
              {new Date(orderItem.createdOn).toLocaleDateString()}
            </p>
          </div>
          <div className="min-w-[128px]">
            <p className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${getStatusClass(orderItem.orderStatusString)}`}>
              {orderItem.orderStatusString}
            </p>
          </div>
          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark truncate max-w-[200px]">{orderTitle}</p>
          </div>
          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark font-bold">{orderItem.orderTotalString}</p>
          </div>
          {/* <div className="flex gap-5 items-center">
            <OrderActions toggleDetails={toggleDetails} toggleEdit={toggleEdit} />
          </div> */}
        </div>
      )}

      {smallView && (
  <div className="block md:hidden border-b border-gray-200 bg-white">
    <div className="py-20 px-6">
      {/* Top Row: Order ID and Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Order ID</span>
          <p className="text-lg font-bold text-dark leading-none">#{orderItem.id}</p>
        </div>
        <span className={`text-xs font-bold py-1 px-3 rounded-full capitalize shadow-sm ${getStatusClass(orderItem.orderStatusString)}`}>
          {orderItem.orderStatusString}
        </span>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-gray-50 pt-4">
        <div>
          <span className="text-xs text-gray-500 block">Date</span>
          <p className="text-sm font-medium text-dark">{new Date(orderItem.createdOn).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">Total</span>
          <p className="text-sm font-bold text-[#116DB2]">{orderItem.orderTotalString}</p>
        </div>
        <div className="col-span-2">
          <span className="text-xs text-gray-500 block">Items</span>
          <p className="text-sm font-medium text-dark line-clamp-1">{orderTitle}</p>
        </div>
      </div>

     
    </div>
  </div>
)}

      <OrderModal showDetails={showDetails} showEdit={showEdit} toggleModal={toggleModal} order={orderItem} />
    </>
  );
};

export default SingleOrder;