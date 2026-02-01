// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   getAddresses,
//   saveAddresses,
//   getStatesOrProvinces,
// } from "@/services/authService";
// import {
//   AccountAddressesRequestResponse,
//   AddressVm,
//   SelectOption,
// } from "@/types/auth";
// import Billing from "../Checkout/Billing";

// const Address = () => {
//   const [addressData, setAddressData] = useState<AccountAddressesRequestResponse | null>(null);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingType, setEditingType] = useState<"shipping" | "billing">("shipping");
//   const [loading, setLoading] = useState(true);
//   const [useDifferentShipping, setUseDifferentShipping] = useState(false);
  
//   // New state for status messages
//   const [status, setStatus] = useState<{ message: string; type: "success" | "error" | null }>({
//     message: "",
//     type: null,
//   });

//   const userToken = typeof window !== "undefined" ? localStorage.getItem("userToken") || "" : "";

//   // Auto-clear status message after 5 seconds
//   useEffect(() => {
//     if (status.message) {
//       const timer = setTimeout(() => setStatus({ message: "", type: null }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [status.message]);

//   useEffect(() => {
//     const init = async () => {
//       if (!userToken) return;
//       try {
//         setLoading(true);
//         const [addrRes, statesRes] = await Promise.all([
//           getAddresses(),
//           getStatesOrProvinces("118"),
//         ]);
//         setAddressData(addrRes);
//         setStates(statesRes);
//       } catch (err) {
//         console.error("Initialization error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, [userToken]);

//   const openEditModal = (type: "shipping" | "billing") => {
//     setEditingType(type);
//     setIsModalOpen(true);
//   };

//   const handleFormChange = (e: any) => {
//     const { name, value } = e.target;
//     if (!addressData) return;
//     const key = editingType === "shipping" ? "newShippingAddress" : "newBillingAddress";
//     setAddressData({
//       ...addressData,
//       [key]: {
//         ...(addressData[key] || {}),
//         [name]: value,
//       } as AddressVm,
//     });
//   };

//   const handleSubmit = async () => {
//     if (!addressData) return;
//     try {
//       const response = await saveAddresses(addressData);
//       if (response.success) {
//         const updatedAddresses = await getAddresses();
//         setAddressData(updatedAddresses);
//         setIsModalOpen(false);
//         setStatus({ message: "Addresses updated successfully!", type: "success" });
//       } else {
//         setStatus({ message: "Failed to update addresses.", type: "error" });
//       }
//     } catch (err) {
//       setStatus({ message: "An error occurred while saving.", type: "error" });
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading Addresses...</div>;

//   return (
//     <div className="p-4 relative">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <AddressCard
//           title="Billing Address"
//           address={addressData?.newBillingAddress}
//           onEdit={() => openEditModal("billing")}
//         />
//         {useDifferentShipping && (
//           <AddressCard
//             title="Shipping Address"
//             address={addressData?.newShippingAddress}
//             onEdit={() => openEditModal("shipping")}
//           />
//         )}
//       </div>

//       <div className="mt-6 flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 w-fit">
//         <input 
//           type="checkbox" 
//           id="toggleShipping"
//           className="w-5 h-5 accent-[#116DB2] cursor-pointer"
//           checked={useDifferentShipping}
//           onChange={(e) => setUseDifferentShipping(e.target.checked)}
//         />
//         <label htmlFor="toggleShipping" className="text-gray-700 font-medium cursor-pointer">
//           Use another Shipping address
//         </label>
//       </div>

//       {/* SUCCESS/ERROR MESSAGE UNDER COMPONENTS */}
//       {status.message && (
//         <div 
//           className={`mt-6 p-4 rounded-lg border text-center transition-all duration-300 ${
//             status.type === "success" 
//               ? "bg-green-50 border-green-200 text-green-700" 
//               : "bg-red-50 border-red-200 text-red-700"
//           }`}
//         >
//           {status.message}
//         </div>
//       )}

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#000000] bg-opacity-50 p-4 overflow-y-auto">
//           <div className="bg-white aborder aborder-gray-200 rounded-2xl w-full max-w-2xl p-6 relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
//             >✕</button>

//             <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
//               Edit {editingType === "shipping" ? "Shipping" : "Billing"} Address
//             </h2>

//             <Billing
//               formData={editingType === "shipping" ? addressData?.newShippingAddress : addressData?.newBillingAddress}
//               onChange={handleFormChange}
//               stateOptions={states}
//               userToken={userToken}
//             />

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 border border-gray-300 rounded-md"
//               >Cancel</button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-6 py-2 bg-[#116DB2] text-white rounded-md font-bold"
//               >Save Changes</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const AddressCard = ({ title, address, onEdit }: any) => (
//   <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm flex flex-col justify-between h-full">
//     <div>
//       <h3 className="text-lg font-bold mb-4 uppercase text-gray-800">{title}</h3>
//       {address && address.contactName ? (
//         <div className="text-sm text-gray-600 space-y-1 mb-6">
//           <p className="font-bold text-gray-900">{address.contactName}</p>
//           <p>{address.phone}</p>
//           <p>{address.addressLine1}</p>
//           <p>{address.addressLine2}</p>
//           <p>{address.city}{address.stateOrProvinceName ? `, ${address.stateOrProvinceName}` : ""}</p>
//           <p className="text-gray-400">{address.districtName} {address.zipCode}</p>
//         </div>
//       ) : (
//         <p className="text-sm text-gray-400 italic mb-6">No address details set.</p>
//       )}
//     </div>
//     <button
//       onClick={onEdit}
//       className="w-fit text-[#116DB2] font-bold text-sm border-b-2 border-[#116DB2] transition-colors hover:text-[#0a4a7a] hover:border-[#0a4a7a]"
//     >
//       {address && address.contactName ? "Edit Address" : "Add Address"}
//     </button>
//   </div>
// );
// 
// export default Address;
"use client";
import React, { useEffect, useState } from "react";
import {
  getAddresses,
  saveAddresses,
  getStatesOrProvinces,
} from "@/services/authService";
import {
  AccountAddressesRequestResponse,
  AddressVm,
  SelectOption,
} from "@/types/auth";
import Billing from "../Checkout/Billing";

const Address = () => {
  const [addressData, setAddressData] = useState<AccountAddressesRequestResponse | null>(null);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<"shipping" | "billing">("billing");
  const [loading, setLoading] = useState(true);

  const isAddressEmpty = (addr: AddressVm | null | undefined) => {
    return !addr || !addr.contactName?.trim() || !addr.addressLine1?.trim();
  };

  const billingExists = !isAddressEmpty(addressData?.newBillingAddress);
  const [dropdown, setDropdown] = useState(false);

  const [status, setStatus] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });

  const userToken = typeof window !== "undefined" ? localStorage.getItem("userToken") || "" : "";

  const emptyAddress: AddressVm = {
    userAddressId: 0,
    contactName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    stateOrProvinceId: 0,
    countryId: "118",
    districtId: 0,
  };

  useEffect(() => {
    const init = async () => {
      if (!userToken) return;
      try {
        setLoading(true);
        const [addrRes, statesRes] = await Promise.all([
          getAddresses(),
          getStatesOrProvinces("118"),
        ]);

        const safeData: AccountAddressesRequestResponse = {
          ...addrRes,
          newBillingAddress: addrRes?.newBillingAddress || { ...emptyAddress },
          newShippingAddress: addrRes?.newShippingAddress || { ...emptyAddress },
          existingShippingAddressId: addrRes?.existingShippingAddressId || null,
        };

        setAddressData(safeData);
        setStates(statesRes);
        
        const shippingIsPopulated = !isAddressEmpty(safeData.newShippingAddress);
        if (shippingIsPopulated) {
          setDropdown(true);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [userToken]);

  const openEditModal = (type: "shipping" | "billing") => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    if (!addressData) return;
    const key = editingType === "shipping" ? "newShippingAddress" : "newBillingAddress";
    setAddressData({
      ...addressData,
      [key]: { ...(addressData[key] || {}), [name]: value } as AddressVm,
    });
  };

  const handleSubmit = async () => {
    if (!addressData) return;
    try {
      const payload = { ...addressData };
      if (!dropdown) {
        payload.newShippingAddress = { ...addressData.newBillingAddress };
      }
      const response = await saveAddresses(payload);
      if (response.success) {
        setStatus({ message: "Addresses updated successfully!", type: "success" });
        const updated = await getAddresses();
        setAddressData(updated);
        setTimeout(() => setStatus({ message: "", type: null }), 10000);
      }
    } catch (err) {
      setStatus({ message: "An error occurred.", type: "error" });
    }
  };

  if (loading) return <div className="p-9 text-center">Loading...</div>;

  return (
    // max-w-4xl (896px) -> max-w-[806px], p-4 -> p-3.5
    <div className="p-3.5 max-w-[806px] mx-auto">
      {/* 1. BILLING CARD: mb-6 -> mb-5.5 */}
      <div className="mb-5.5">
        <AddressCard
          title="Billing Address"
          address={addressData?.newBillingAddress}
          onEdit={() => openEditModal("billing")}
        />
      </div>

      {billingExists ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300">
          <div
            onClick={() => setDropdown(!dropdown)}
            // gap-2.5 -> gap-2, text-sm -> text-[12.6px], py-5 -> py-4.5
            className="cursor-pointer flex items-center gap-2 font-bold text-[12.6px] uppercase text-gray-800 py-4.5 px-5 hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={dropdown}
              readOnly
              className="w-3.5 h-3.5 accent-[#116DB2]"
            />
            Ship to a different address?
            {/* SVG width/height 22 -> 20 */}
            <svg
              className={`fill-current ease-out duration-200 ml-auto ${dropdown && "rotate-180"}`}
              width="20" height="20" viewBox="0 0 22 22" fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z" fill="currentColor" />
            </svg>
          </div>

          {/* p-6 -> p-5.5 */}
          <div className={`p-5.5 border-t border-gray-100 bg-gray-50/30 ${dropdown ? "block" : "hidden"}`}>
            <p className="text-[10.8px] text-gray-500 mb-5.5 italic">Please manage your shipping destination details below.</p>
            <AddressCard
              title="Shipping Address"
              address={addressData?.newShippingAddress}
              isEmpty={isAddressEmpty(addressData?.newShippingAddress)}
              onEdit={() => openEditModal("shipping")}
            />
          </div>
        </div>
      ) : (
        <div className="p-5.5 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
            <p className="text-[12.6px] text-gray-500">Please provide a billing address first to enable separate shipping.</p>
        </div>
      )}

      {/* SAVE BUTTON & STATUS: mt-8 -> mt-7 */}
      <div className="mt-7 flex flex-col items-end gap-3.5">
        <button
          onClick={handleSubmit}
          // py-3 -> py-2.5, px-10 -> px-9, text-[14px] -> text-[12.6px]
          className="inline-flex font-semibold text-white text-[12.6px] 2xl:text-[13.5px] rounded-full bg-[#116DB2] py-2.5 px-9 hover:bg-[#AD003A] transition-all duration-300 shadow-md"
        >
          Save Addresses
        </button>
        {status.message && (
          <p className={`text-[12.6px] ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </div>

      {/* MODAL: p-6 -> p-5.5, max-w-2xl -> max-w-[612px] */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/50 p-3.5">
          <div className="bg-white rounded-2xl w-full max-w-[612px] p-5.5 relative">
            <h2 className="text-[18px] font-bold mb-5.5">Edit {editingType}</h2>
            <Billing
              formData={editingType === "shipping" ? addressData?.newShippingAddress : addressData?.newBillingAddress}
              onChange={handleFormChange}
              stateOptions={states}
              userToken={userToken}
            />
            <div className="mt-5.5 flex justify-end gap-2.5">
              <button onClick={() => setIsModalOpen(false)} className="px-5.4 py-1.8 border rounded-md text-[12.6px]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddressCard = ({ title, address, onEdit }: any) => (
  // p-6 -> p-5.5, gap-4 -> gap-3.5
  <div className="border border-gray-200 rounded-xl p-5.5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5">
    <div>
      {/* text-xs -> text-[10.8px] */}
      <h3 className="text-[10.8px] font-bold uppercase text-gray-400 mb-1.5">{title}</h3>
      {address?.contactName ? (
        <div className="text-[12.6px] text-gray-700">
          <span className="font-bold text-gray-900">{address.contactName}</span> — {address.addressLine1}, {address.city}
        </div>
      ) : (
        <span className="text-[12.6px] text-gray-400 italic">No address provided</span>
      )}
    </div>
    <button
      onClick={onEdit}
      className="text-[#116DB2] font-bold text-[12.6px] hover:underline"
    >
      {address?.contactName ? "Change" : "Add Address"}
    </button>
  </div>
);

export default Address;