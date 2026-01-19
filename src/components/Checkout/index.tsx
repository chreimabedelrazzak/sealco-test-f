// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Shipping from "./Shipping";
// import PaymentMethod from "./PaymentMethod";
// import Coupon from "./Coupon";
// import Billing from "./Billing";
// import BreadcrumbThree from "../Common/CartSidebarModal/BreadcrumbThree";
// import { checkoutService } from "@/services/checkoutService";
// import { CheckoutVm, SelectOption } from "@/types/checkout";
// // import { toast } from "react-toastify";

// const Checkout = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const checkoutId = searchParams.get("checkoutId");
//   const userToken =
//     typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

//   const [formData, setFormData] = useState({
//     contactName: "",
//     phone: "",
//     addressLine1: "",
//     addressLine2: "",
//     stateOrProvinceId: 0,
//     districtId: 0,
//     city: "",
//     zipCode: "",
//     countryId: 118, // Fixed: must be number
//   });

//   const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
//   const [existingAddressId, setExistingAddressId] = useState<number>(0);
//   const [checkoutData, setCheckoutData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdatingTotals, setIsUpdatingTotals] = useState(false);
//   const [orderNote, setOrderNote] = useState("");

//   // Inside your Checkout component
//   const emptyAddress = {
//     contactName: "",
//     phone: "",
//     addressLine1: "",
//     addressLine2: "",
//     stateOrProvinceId: 0,
//     districtId: 0,
//     city: "",
//     zipCode: "",
//     countryId: 118,
//   };

//   const [billingAddress, setBillingAddress] = useState(emptyAddress);
//   const [shippingAddress, setShippingAddress] = useState(emptyAddress);
//   const [useDifferentShipping, setUseDifferentShipping] = useState(false);

//   const handleBillingChange = (e: any) => {
//     const { name, value } = e.target;
//     const isIdField = ["stateOrProvinceId", "districtId", "countryId"].includes(
//       name
//     );
//     const finalValue = isIdField ? parseInt(value) || 0 : value;
//     setBillingAddress((prev) => ({ ...prev, [name]: finalValue }));
//   };

//   const handleShippingChange = (e: any) => {
//     const { name, value } = e.target;
//     const isIdField = ["stateOrProvinceId", "districtId", "countryId"].includes(
//       name
//     );
//     const finalValue = isIdField ? parseInt(value) || 0 : value;
//     setShippingAddress((prev) => ({ ...prev, [name]: finalValue }));
//   };

//   // SECURITY CHECK
//   useEffect(() => {
//     if (!checkoutId) router.push("/cart");
//     if (!userToken) router.push("/signin");
//   }, [checkoutId, userToken, router]);

//   // INITIAL HYDRATION
//   // useEffect(() => {
//   //   const fetchInitialData = async () => {
//   //     if (!checkoutId || !userToken) return;
//   //     try {
//   //       setIsLoading(true);
//   //       const response = await checkoutService.getShippingInfo(
//   //         checkoutId,
//   //         userToken
//   //       );
//   //       setStateOptions(response.newAddressForm.stateOrProvinces || []);

//   //       if (response.existingShippingAddresses?.length > 0) {
//   //         const addr = response.existingShippingAddresses[0];
//   //         setExistingAddressId(addr.userAddressId);
//   //         setFormData({
//   //           contactName: addr.contactName || "",
//   //           phone: addr.phone || "",
//   //           addressLine1: addr.addressLine1 || "",
//   //           addressLine2: addr.addressLine2 || "",
//   //           stateOrProvinceId: addr.stateOrProvinceId || 0,
//   //           districtId: addr.districtId || 0,
//   //           city: addr.city || "",
//   //           zipCode: addr.zipCode || "",
//   //           countryId: addr.countryId || 118,
//   //         });
//   //       }

//   //       const summary = await checkoutService.updateTaxAndShippingPrices(
//   //         checkoutId,
//   //         userToken,
//   //         {
//   //           selectedShippingMethodName: response.shippingMethod || "Free",
//   //           existingShippingAddressId: response.shippingAddressId || 0,
//   //           newShippingAddress: {},
//   //           newBillingAddress: {},
//   //         }
//   //       );
//   //       setCheckoutData(summary.checkoutVm);
//   //     } catch (error) {
//   //       console.error("Error loading checkout data:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };
//   //   fetchInitialData();
//   // }, [checkoutId, userToken]);

//   // INITIAL HYDRATION
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       if (!checkoutId || !userToken) return;
//       try {
//         setIsLoading(true);
//         const response = await checkoutService.getShippingInfo(
//           checkoutId,
//           userToken
//         );
//         setStateOptions(response.newAddressForm.stateOrProvinces || []);

//         if (response.existingShippingAddresses?.length > 0) {
//           const addr = response.existingShippingAddresses[0];
//           setExistingAddressId(addr.userAddressId);

//           // MAP DATA TO THE NEW STATE OBJECTS
//           const mappedAddress = {
//             contactName: addr.contactName || "",
//             phone: addr.phone || "",
//             addressLine1: addr.addressLine1 || "",
//             addressLine2: addr.addressLine2 || "",
//             stateOrProvinceId: addr.stateOrProvinceId || 0,
//             districtId: addr.districtId || 0,
//             city: addr.city || "",
//             zipCode: addr.zipCode || "",
//             countryId: addr.countryId || 118,
//           };

//           // Update BOTH the old formData (for compatibility) and the new billingAddress state
//           setFormData(mappedAddress);
//           setBillingAddress(mappedAddress);

//           // Initialize shipping address with the same data by default
//           setShippingAddress(mappedAddress);
//         }

//         const summary = await checkoutService.updateTaxAndShippingPrices(
//           checkoutId,
//           userToken,
//           {
//             selectedShippingMethodName: response.shippingMethod || "Free",
//             existingShippingAddressId: response.shippingAddressId || 0,
//             newShippingAddress: {},
//             newBillingAddress: {},
//           }
//         );
//         setCheckoutData(summary.checkoutVm);
//       } catch (error) {
//         console.error("Error loading checkout data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [checkoutId, userToken]);

//   // REFRESH TOTALS
//   const refreshTotals = useCallback(async () => {
//     if (!checkoutId || !userToken) return;
//     setIsUpdatingTotals(true);
//     try {
//       const summary = await checkoutService.updateTaxAndShippingPrices(
//         checkoutId,
//         userToken,
//         {
//           selectedShippingMethodName:
//             checkoutData?.selectedShippingMethodName || "Free",
//           existingShippingAddressId: existingAddressId,
//           newShippingAddress: existingAddressId === 0 ? formData : {},
//           newBillingAddress: {},
//         }
//       );
//       setCheckoutData(summary.checkoutVm);
//     } catch (error) {
//       console.error("Failed to refresh totals:", error);
//     } finally {
//       setIsUpdatingTotals(false);
//     }
//   }, [checkoutId, userToken, formData, existingAddressId]);

//   // WATCH FOR LOCATION CHANGE
//   useEffect(() => {
//     if (formData.stateOrProvinceId !== 0) {
//       refreshTotals();
//     }
//   }, [formData.stateOrProvinceId, formData.districtId]);

//   const handleInputChange = (e: any) => {
//     const { name, value } = e.target;
//     const isIdField = ["stateOrProvinceId", "districtId", "countryId"].includes(
//       name
//     );
//     const finalValue = isIdField ? parseInt(value) || 0 : value;

//     if (existingAddressId !== 0) setExistingAddressId(0);
//     setFormData((prev) => ({ ...prev, [name]: finalValue }));
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (!checkoutId || !userToken) return;

//   //   try {
//   //     setIsUpdatingTotals(true);

//   //     // 1. Save Address Info
//   //     await checkoutService.saveShippingInfo(checkoutId, userToken, {
//   //       checkoutId: checkoutId, // Added missing property
//   //       shippingAddressId: existingAddressId,
//   //       billingAddressId: existingAddressId, // Added missing property
//   //       shippingMethod: checkoutData?.selectedShippingMethodName || "Free", // Added missing property
//   //       newAddressForm: existingAddressId === 0 ? formData : ({} as any),
//   //       newBillingAddressForm: {} as any,
//   //       useShippingAddressAsBillingAddress: true,
//   //       orderNote: orderNote,
//   //     });

//   //     // 2. Complete Order (CoD)
//   //     const result = await checkoutService.completeOrderCoD(
//   //       checkoutId,
//   //       userToken
//   //     );

//   //     // Navigate to success page
//   //     router.push(`/order-confirmation?orderId=${result.orderId}`);
//   //   } catch (error: any) {
//   //     console.error("Order Submission Error:", error);
//   //     // Optional: alert("Order failed. Please check your connection.");
//   //   } finally {
//   //     setIsUpdatingTotals(false);
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!checkoutId || !userToken) return;

//     try {
//       setIsUpdatingTotals(true);

//       // Determine final shipping address based on toggle
//       const finalShippingAddress = useDifferentShipping
//         ? shippingAddress
//         : billingAddress;

//       await checkoutService.saveShippingInfo(checkoutId, userToken, {
//         checkoutId: checkoutId,
//         shippingAddressId: 0, // Using new addresses
//         billingAddressId: 0,
//         shippingMethod: checkoutData?.selectedShippingMethodName || "Free",
//         newAddressForm: finalShippingAddress,
//         newBillingAddressForm: billingAddress,
//         useShippingAddressAsBillingAddress: !useDifferentShipping,
//         orderNote: orderNote,
//       });

//       const result = await checkoutService.completeOrderCoD(
//         checkoutId,
//         userToken
//       );
//       router.push(`/order-confirmation?orderId=${result.orderId}`);
//     } catch (error: any) {
//       console.error("Order Submission Error:", error);
//     } finally {
//       setIsUpdatingTotals(false);
//     }
//   };

//   if (!checkoutId || !userToken) return null;

//   return (
//     <div className="bg-white min-h-screen">
//       <BreadcrumbThree title={"Checkout"} pages={["checkout"]} />
//       <section className="py-12 lg:py-20">
//         <div className="max-w-[1200px] 2xl:max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
//           <div className="flex w-full mb-12 overflow-hidden rounded-full border border-gray-100">
//             <div className="flex-1 bg-[#F6F6F6] text-gray-400 py-3 text-center font-bold text-sm">
//               Shopping Cart
//             </div>
//             <div className="flex-1 bg-[#116DB2] text-white py-3 text-center font-bold text-sm">
//               Delivery & Payment
//             </div>
//             <div className="flex-1 bg-[#F6F6F6] text-gray-400 py-3 text-center font-bold text-sm">
//               Receipt
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#116DB2] mb-4"></div>
//               <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
//                 Loading...
//               </p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit}>
//               <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
//                 <div className="flex-1">
//                   {/* <div className="space-y-10">
//                     <Billing
//                       formData={formData}
//                       onChange={handleInputChange}
//                       stateOptions={stateOptions}
//                       userToken={userToken}
//                     />
//                     <div className="pt-8">
//                       <Shipping
//                         formData={formData}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="pt-8">
//                       <label
//                         htmlFor="notes"
//                         className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide"
//                       >
//                         Other Notes (optional)
//                       </label>
//                       <textarea
//                         value={orderNote}
//                         onChange={(e) => setOrderNote(e.target.value)}
//                         rows={4}
//                         placeholder="Notes about your order..."
//                         className="w-full border border-gray-200 p-4 rounded bg-[#FDFDFD] outline-none focus:border-[#116DB2] text-sm resize-none"
//                       ></textarea>
//                     </div>
//                   </div> */}
//                   <div className="space-y-10">
//                     {/* Always show Billing */}
//                     <Billing
//                       formData={billingAddress}
//                       onChange={handleBillingChange}
//                       stateOptions={stateOptions}
//                       userToken={userToken}
//                     />

//                     {/* Toggle Logic */}
//                     <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mt-8">
//                       <div
//                         onClick={() =>
//                           setUseDifferentShipping(!useDifferentShipping)
//                         }
//                         className="cursor-pointer flex items-center gap-2.5 font-bold text-sm uppercase text-gray-800 py-5 px-5.5 hover:bg-gray-50 transition-colors"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={useDifferentShipping}
//                           readOnly
//                           className="w-4 h-4 accent-[#116DB2]"
//                         />
//                         Ship to a different address?
//                         <svg
//                           className={`fill-current ease-out duration-200 ml-auto ${useDifferentShipping && "rotate-180"}`}
//                           width="22"
//                           height="22"
//                           viewBox="0 0 22 22"
//                           fill="none"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
//                             fill="currentColor"
//                           />
//                         </svg>
//                       </div>

//                       {/* Conditionally show Shipping form */}
//                       <div
//                         className={`p-6 border-t border-gray-100 bg-gray-50/30 ${useDifferentShipping ? "block" : "hidden"}`}
//                       >
//                         <p className="text-xs text-gray-500 mb-6 italic">
//                           Please enter the shipping destination details below.
//                         </p>

//                         {/* You can reuse the Billing component structure for Shipping fields */}
//                         <Billing
//                           formData={shippingAddress}
//                           onChange={handleShippingChange}
//                           stateOptions={stateOptions}
//                           userToken={userToken}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="lg:w-[450px] relative">
//                   <div className="sticky top-24">
// {isUpdatingTotals && (
//   <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
//     <div className="flex gap-2">
//       <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce"></div>
//       <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce [animation-delay:-.3s]"></div>
//       <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce [animation-delay:-.5s]"></div>
//     </div>
//   </div>
// )}
//                     <h2 className="text-2xl font-bold text-black mb-6">
//                       Order Summary
//                     </h2>
// <div className="border-t border-gray-200">
//   <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto">
//     {checkoutData?.items?.map((item: any) => (
//       <div
//         key={item.id}
//         className="flex justify-between items-start gap-4 text-sm"
//       >
//         <p className="font-bold text-gray-800">
//           {item.productName}{" "}
//           <span className="text-gray-400">
//             x{item.quantity}
//           </span>
//         </p>
//         <span className="font-bold text-black">
//           {item.totalString}
//         </span>
//       </div>
//     ))}
//   </div>

//   <div className="py-4 border-t border-gray-100 space-y-3">
//     <div className="flex justify-between text-sm font-bold text-gray-800">
//       <span>Subtotal</span>
//       <span>{checkoutData?.subTotalString}</span>
//     </div>
//     <div className="flex justify-between text-sm font-bold text-gray-800">
//       <span>Shipping Fee</span>
//       <span>{checkoutData?.shippingAmountString}</span>
//     </div>
//     <div className="flex justify-between text-sm font-bold text-gray-800">
//       <span>Tax</span>
//       <span>{checkoutData?.taxAmountString}</span>
//     </div>
//   </div>

//   <div className="py-6 border-t border-gray-100 mb-8">
//     <div className="flex items-center justify-between">
//       <p className="text-xl font-bold text-black">Total</p>
//       <p className="text-2xl font-bold text-[#116DB2]">
//         {checkoutData?.orderTotalString}
//       </p>
//     </div>
//   </div>

//   <div className="space-y-6">
//     {/* <Coupon /> */}
//     <PaymentMethod />
//   </div>

//                       <button
//                         type="submit"
//                         // disabled={!checkoutData?.isValid || isUpdatingTotals}
//                         className={`w-full mt-10 text-white py-4 rounded-full font-bold uppercase text-sm tracking-wider transition-colors ${
//                           checkoutData?.isValid && !isUpdatingTotals
//                             ? "bg-[#116DB2] hover:bg-black"
//                             : "bg-red"
//                         }`}
//                       >
//                         {isUpdatingTotals
//                           ? "Processing..."
//                           : checkoutData?.isValid
//                             ? "Complete Purchase"
//                             : "Invalid Order"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Checkout;

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Shipping from "./Shipping";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import BreadcrumbThree from "../Common/CartSidebarModal/BreadcrumbThree";
import { checkoutService } from "@/services/checkoutService";
import { CheckoutVm, SelectOption } from "@/types/checkout";

const Checkout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("checkoutId");
  const userToken =
    typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

  const emptyAddress = {
    contactName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    stateOrProvinceId: 0,
    districtId: 0,
    city: "",
    zipCode: "",
    countryId: 118,
  };

  const [billingAddress, setBillingAddress] = useState(emptyAddress);
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [useDifferentShipping, setUseDifferentShipping] = useState(false);
  const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTotals, setIsUpdatingTotals] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  // Helper to check if an address is actually provided
  const isAddressValid = (addr: any) => {
    return addr && addr.contactName?.trim() && addr.addressLine1?.trim();
  };

  const handleBillingChange = (e: any) => {
    const { name, value } = e.target;
    const isIdField = ["stateOrProvinceId", "districtId", "countryId"].includes(
      name,
    );
    const finalValue = isIdField ? parseInt(value) || 0 : value;
    setBillingAddress((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleShippingChange = (e: any) => {
    const { name, value } = e.target;
    const isIdField = ["stateOrProvinceId", "districtId", "countryId"].includes(
      name,
    );
    const finalValue = isIdField ? parseInt(value) || 0 : value;
    setShippingAddress((prev) => ({ ...prev, [name]: finalValue }));
  };

  // INITIAL HYDRATION
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!checkoutId || !userToken) return;
      try {
        setIsLoading(true);
        const response = await checkoutService.getShippingInfo(
          checkoutId,
          userToken,
        );
        setStateOptions(response.newAddressForm.stateOrProvinces || []);

        // 1. Handle Billing Data
        if (response.existingBillingAddresses?.length > 0) {
          setBillingAddress({
            ...emptyAddress,
            ...response.existingBillingAddresses[0],
          });
        }

        // 2. Handle Shipping Data
        if (response.existingShippingAddresses?.length > 0) {
          const shipAddr = response.existingShippingAddresses[0];
          setShippingAddress({ ...emptyAddress, ...shipAddr });

          // If shipping is different from billing, open the toggle automatically
          const billAddr = response.existingBillingAddresses?.[0];
          if (billAddr && shipAddr.addressLine1 !== billAddr.addressLine1) {
            setUseDifferentShipping(true);
          }
        }

        const summary = await checkoutService.updateTaxAndShippingPrices(
          checkoutId,
          userToken,
          {
            selectedShippingMethodName: response.shippingMethod || "Free",
            existingShippingAddressId: response.shippingAddressId || 0,
            newShippingAddress: {},
            newBillingAddress: {},
          },
        );
        setCheckoutData(summary.checkoutVm);
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [checkoutId, userToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutId || !userToken) return;

    try {
      setIsUpdatingTotals(true);
      const finalShipping = useDifferentShipping
        ? shippingAddress
        : billingAddress;

      await checkoutService.saveShippingInfo(checkoutId, userToken, {
        checkoutId: checkoutId,
        shippingAddressId: 0,
        billingAddressId: 0,
        shippingMethod: checkoutData?.selectedShippingMethodName || "Free",
        newAddressForm: finalShipping,
        newBillingAddressForm: billingAddress,
        useShippingAddressAsBillingAddress: !useDifferentShipping,
        orderNote: orderNote,
      });

      const result = await checkoutService.completeOrderCoD(
        checkoutId,
        userToken,
      );
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    } catch (error: any) {
      console.error("Order Submission Error:", error);
    } finally {
      setIsUpdatingTotals(false);
    }
  };

  if (!checkoutId || !userToken) return null;

  const billingProvided = isAddressValid(billingAddress);

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbThree title={"Checkout"} pages={["checkout"]} />
      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] 2xl:max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Progress Tracker Bar */}

          <div className="flex w-full mb-8 overflow-hidden rounded-full border border-gray-100 shadow-sm">
            {/* Step 1: Shopping Cart */}
            <div className="flex-1 bg-[#F6F6F6] text-gray-400 py-3 px-1 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
              <span>Shopping Cart</span>
            </div>

            {/* Step 2: Delivery & Payment */}
            <div className="flex-1 bg-[#116DB2] text-white  py-3 px-1 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-x border-white">
              <span className="hidden sm:inline">Delivery & Payment</span>
              <span className="sm:hidden">Delivery</span>{" "}
              {/* Shorter text for mobile */}
            </div>

            {/* Step 3: Receipt */}
            <div className="flex-1 bg-[#F6F6F6] text-gray-400 py-3 px-1 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
              <span>Receipt</span>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#116DB2] mb-4"></div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                Loading...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
                <div className="flex-1">
                  <div className="space-y-8">
                    {/* STEP 1: BILLING */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#116DB2] text-white text-xs">
                          1
                        </span>
                        Billing Address
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <Billing
                          formData={billingAddress}
                          onChange={handleBillingChange}
                          stateOptions={stateOptions}
                          userToken={userToken}
                        />
                      </div>
                    </div>

                    {/* STEP 2: SHIPPING (Visible only if Billing has content) */}
                    {billingProvided ? (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                          <div
                            onClick={() =>
                              setUseDifferentShipping(!useDifferentShipping)
                            }
                            className="cursor-pointer flex items-center gap-2.5 font-bold text-sm uppercase text-gray-800 py-5 px-5.5 hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={useDifferentShipping}
                              readOnly
                              className="w-4 h-4 accent-[#116DB2]"
                            />
                            Ship to a different address?
                            <svg
                              className={`fill-current ease-out duration-200 ml-auto ${useDifferentShipping && "rotate-180"}`}
                              width="22"
                              height="22"
                              viewBox="0 0 22 22"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>

                          <div
                            className={`p-6 border-t border-gray-100 bg-gray-50/30 ${useDifferentShipping ? "block" : "hidden"}`}
                          >
                            <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#116DB2] text-white text-xs">
                                2
                              </span>
                              Shipping Destination
                            </h3>
                            <Billing
                              formData={shippingAddress}
                              onChange={handleShippingChange}
                              stateOptions={stateOptions}
                              userToken={userToken}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                          Please complete the billing address above to enable
                          shipping options.
                        </p>
                      </div>
                    )}

                    {/* ORDER NOTES */}
                    <div className="pt-4">
                      <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">
                        Other Notes (optional)
                      </label>
                      <textarea
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        rows={3}
                        placeholder="Notes about your order, e.g. special instructions for delivery."
                        className="w-full border border-gray-200 p-4 rounded-xl bg-[#FDFDFD] outline-none focus:border-[#116DB2] text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary (Sticky) */}
                <div className="lg:w-[450px] relative">
                  <div className="sticky top-24 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    {isUpdatingTotals && (
                      <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-2 h-2 bg-[#116DB2] rounded-full animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-black mb-6">
                      Order Summary
                    </h2>

                    <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto">
                      {checkoutData?.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start gap-4 text-sm"
                        >
                          <p className="font-bold text-gray-800">
                            {item.productName}{" "}
                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>
                          </p>
                          <span className="font-bold text-black">
                            {item.totalString}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="py-4 border-t border-gray-100 space-y-3">
                      <div className="flex justify-between text-sm font-bold text-gray-800">
                        <span>Subtotal</span>
                        <span>{checkoutData?.subTotalString}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-800">
                        <span>Shipping Fee</span>
                        <span>{checkoutData?.shippingAmountString}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-800">
                        <span>Tax</span>
                        <span>{checkoutData?.taxAmountString}</span>
                      </div>
                    </div>

                    <div className="py-6 border-t border-gray-100 mb-8">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-black">Total</p>
                        <p className="text-2xl font-bold text-[#116DB2]">
                          {checkoutData?.orderTotalString}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* <Coupon /> */}
                      <PaymentMethod />
                    </div>
                    <button
                      type="submit"
                      disabled={!billingProvided || isUpdatingTotals}
                      className={`w-full mt-10 text-white py-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all ${
                        billingProvided && !isUpdatingTotals
                          ? "bg-[#116DB2] hover:bg-black shadow-lg"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {isUpdatingTotals ? "Processing..." : "Complete Purchase"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Checkout;
