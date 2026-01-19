"use client";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import BreadcrumbThree from "../Common/CartSidebarModal/BreadcrumbThree";
import { logout, changeFullName } from "@/services/authService"; // Added changeFullName
import Wishlist from "../Wishlist";
import Address from "./Address";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addressModal, setAddressModal] = useState(false);

  // Name States
  const [fullName, setFullName] = useState<string>("Guest");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    if (storedName) {
      setFullName(storedName);
      // Split stored name into first and last for the form inputs
      const nameParts = storedName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }
  }, []);

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const combinedName = `${firstName} ${lastName}`.trim();

    // 1. Get the token right before the call
    const token = localStorage.getItem("userToken");

    if (!token) {
      setMessage({
        type: "error",
        text: "Session expired. Please log in again.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 2. Pass both name and token
      const result = await changeFullName(combinedName, token);

      if (result.success) {
        setFullName(result.fullName);
        setMessage({ type: "success", text: "Name updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update name.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("userToken");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("customerId");
    window.location.href = "/signin";
  };

  // Dashboard cards configuration
  const dashboardCards = [
    {
      id: "account-details",
      title: "Personal Data",
      desc: "SHOW OR UPDATE YOUR PERSONAL INFORMATION",
    },
    {
      id: "addresses",
      title: "Addresses",
      desc: "MANAGE YOUR BILLING AND ADDRESSES",
    },
    {
      id: "dashboard",
      title: "Loyalty + Rewards",
      desc: "VIEW YOUR LOYALTY DASHBOARD",
    },
    {
      id: "orders",
      title: "Orders",
      desc: "CHECK THE STATUS OF YOUR ORDERS OR SEE PAST ORDERS",
    },
    {
      id: "wishlist",
      title: "Wish List",
      desc: "VIEW AND MODIFY ITEMS ON YOUR LIST OR INVITE FRIENDS",
    },
    {
      id: "gifts",
      title: "My Gifts",
      desc: "VIEW AND MODIFY YOUR GIFT REGISTRIES",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbThree title={"My Account"} pages={["my account"]} />

      <section className="py-12">
        <div className="max-w-[1200px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
            {/* LEFT SIDEBAR */}
            <aside className="lg:w-[280px] flex-shrink-0 hidden lg:flex">
              <nav className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">
                    My Account
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <button
                        onClick={() => setActiveTab("account-details")}
                        className={`text-sm font-medium transition-colors ${activeTab === "account-details" ? "text-[#116DB2]" : "text-gray-400 hover:text-[#000000]"}`}
                      >
                        Personal
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("addresses")}
                        className={`text-sm font-medium transition-colors ${activeTab === "addresses" ? "text-[#116DB2]" : "text-gray-400 hover:text-[#000000]"}`}
                      >
                        Data Addresses
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`text-sm font-medium transition-colors ${activeTab === "dashboard" ? "text-[#116DB2]" : "text-gray-400 hover:text-[#000000]"}`}
                      >
                        Loyalty Dashboard
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">
                    Order Information
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className={`text-sm font-medium transition-colors ${activeTab === "orders" ? "text-[#116DB2]" : "text-gray-400 hover:text-[#000000]"}`}
                      >
                        Order History
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">
                    Wish List
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <button
                        onClick={() => setActiveTab("wishlist")}
                        className={`text-sm font-medium transition-colors ${activeTab === "wishlist" ? "text-[#116DB2]" : "text-gray-400 hover:text-[#000000]"}`}
                      >
                        Modify Wish List
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 pb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#000000] tracking-tight">
                  My Account | {fullName}
                </h1>
                <button
                  onClick={handleLogout}
                  className="bg-[#116DB2] text-white px-10 py-2.5 rounded-full font-bold text-sm hover:bg-black transition-colors uppercase"
                >
                  Logout
                </button>
              </div>

              {/* DASHBOARD GRID */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  {dashboardCards.map((card, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(card.id)}
                      className="flex flex-col items-center justify-center text-center p-10 border border-gray-200 rounded-xl hover:border-[#116DB2] transition-all group min-h-[180px]"
                    >
                      <span className="text-3xl font-bold text-[#000000] mb-3 group-hover:text-[#116DB2]">
                        {card.title}
                      </span>
                      <span className="text-md font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                        {card.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "orders" && <Orders />}
              {activeTab === "wishlist" && <Wishlist />}

              {/* ADDRESSES TAB */}
              {activeTab === "addresses" && (
                <Address />
                // <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                //   <div className="border border-gray-200 rounded-xl p-8 bg-white relative">
                //     <h3 className="text-lg font-bold mb-4 uppercase">
                //       Shipping Address
                //     </h3>
                //     <p className="text-sm text-gray-500 leading-relaxed mb-6">
                //       7398 Smoke Ranch Road
                //       <br />
                //       Las Vegas, Nevada 89128
                //     </p>
                //     <button
                //       onClick={() => setAddressModal(true)}
                //       className="text-[#116DB2] font-bold text-sm border-b border-[#116DB2]"
                //     >
                //       Edit Address
                //     </button>
                //   </div>
                //   <div className="border border-gray-200 rounded-xl p-8 bg-white">
                //     <h3 className="text-lg font-bold mb-4 uppercase">
                //       Billing Address
                //     </h3>
                //     <p className="text-sm text-gray-500 leading-relaxed mb-6">
                //       Same as shipping address
                //     </p>
                //     <button
                //       onClick={() => setAddressModal(true)}
                //       className="text-[#116DB2] font-bold text-sm border-b border-[#116DB2]"
                //     >
                //       Edit Address
                //     </button>
                //   </div>
                // </div>
              )}

              {/* ACCOUNT DETAILS TAB */}
              {activeTab === "account-details" && (
                <div className="max-w-2xl animate-fadeIn">
                  <form onSubmit={handleChangeName} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-2 uppercase">
                          First Name*
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full border border-gray-200 p-3 rounded bg-[#FDFDFD] outline-none focus:border-[#116DB2]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 uppercase">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full border border-gray-200 p-3 rounded bg-[#FDFDFD] outline-none focus:border-[#116DB2]"
                          required
                        />
                      </div>
                    </div>

                    {message.text && (
                      <p
                        className={`text-sm font-bold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {message.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`bg-[#116DB2] text-white px-8 py-3 rounded-full font-bold text-sm uppercase transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#AD003A]"}`}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}

              <div className="mt-20">
                <p className="text-[10px] text-gray-400 italic font-medium">
                  * Key feature may different from Key Spec
                </p>
              </div>
            </main>
          </div>
        </div>
      </section>

      <AddressModal
        isOpen={addressModal}
        closeModal={() => setAddressModal(false)}
      />
    </div>
  );
};

export default MyAccount;
