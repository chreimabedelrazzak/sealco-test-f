// "use client";
// import BreadcrumbThree from "@/components/Common/CartSidebarModal/BreadcrumbThree";
// import Link from "next/link";
// import Image from "next/image";
// import React, { useState } from "react";
// import { login } from "@/services/authService"; // Ensure this path matches your folder structure
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff } from "lucide-react";

// const Signin = () => {
//   const router = useRouter();

//   // 1. State for form fields
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);

//   // 2. State for UI feedback
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 3. Submit Handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await login({ email, password, rememberMe });

//       if (response.success) {
//         // Success logic: Redirect to home or dashboard
//         router.push("/my-account");
//       } else {
//         setError(
//           response.error || "Login failed. Please check your credentials."
//         );
//       }
//     } catch (err: any) {
//       setError("An unexpected error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <BreadcrumbThree title={"Sign in"} pages={["Sign in"]} />

//       <section className="py-12 lg:py-20">
//         <div className="max-w-[1200px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-8">
//           <div className="flex flex-col lg:flex-row gap-16 xl:gap-32">
//             {/* LEFT SIDE: Sign In Form */}
//             <div className="flex-1">
//               {/* Display Error Message if it exists */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
//                   {error}
//                 </div>
//               )}

//               <form className="max-w-[480px]" onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                   <input
//                     type="email"
//                     placeholder="Email*"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full border border-gray-200 p-3 rounded bg-[#FDFDFD] text-sm outline-none focus:border-[#116DB2]"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"} // Dynamic type change
//                       placeholder="Password*"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full border border-gray-200 p-3 rounded bg-[#FDFDFD] text-sm outline-none focus:border-[#116DB2] pr-10"
//                     />
//                     <button
//                       type="button" // Important: specify type="button" so it doesn't submit the form
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mb-8">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`bg-[#116DB2] text-white px-12 py-3 rounded-full font-bold uppercase text-sm transition-colors ${
//                       loading
//                         ? "opacity-50 cursor-not-allowed"
//                         : "hover:bg-black"
//                     }`}
//                   >
//                     {loading ? "Signing In..." : "Sign In"}
//                   </button>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
//                     <input
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       className="w-4 h-4 rounded border-gray-300"
//                     />
//                     Remember Me
//                   </label>
//                 </div>

//                 <Link
//                   href="#"
//                   className="text-[#116DB2] text-sm font-bold pb-0.5"
//                 >
//                   Forgot Password?
//                 </Link>
//               </form>
//             </div>

//             {/* RIGHT SIDE: Call to Action */}
//             <div className="lg:w-[450px]">
//               <h2 className="text-3xl font-bold text-[#000000] mb-8">
//                 Not a member yet?
//               </h2>
//               <div className="mb-10">
//                 <p className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">
//                   Not a member yet?
//                 </p>
//                 <Link
//                   href="/signup"
//                   className="inline-block w-full text-center bg-[#116DB2] text-white py-4 rounded-full font-bold uppercase text-sm hover:bg-black transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </div>

//               <div className="space-y-8">
//                 <div className="flex flex-col">
//                   <p className="text-sm font-bold text-black mb-2 uppercase">
//                     Enjoy your product to the fullest :
//                   </p>
//                   <p className="text-xs text-gray-500 leading-relaxed font-medium">
//                     Maximizing your LG product experience with helpful
//                     information about all your registered products
//                   </p>
//                 </div>
//                 <div className="flex flex-col">
//                   <p className="text-sm font-bold text-black mb-2 uppercase">
//                     Let LG know how to reach you :
//                   </p>
//                   <p className="text-xs text-gray-500 leading-relaxed font-medium">
//                     Managing your customer profile so LG knows how and when to
//                     communicate with you
//                   </p>
//                 </div>
//                 <div className="flex flex-col">
//                   <p className="text-sm font-bold text-black mb-2 uppercase">
//                     Everything in one location :
//                   </p>
//                   <p className="text-xs text-gray-500 leading-relaxed font-medium">
//                     A single account that allows for various interaction with LG
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* BOTTOM SECTION: Support Options */}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Signin;
"use client";
import BreadcrumbThree from "@/components/Common/CartSidebarModal/BreadcrumbThree";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { login } from "@/services/authService"; 
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password, rememberMe });
      if (response.success) {
        router.push("/my-account");
      } else {
        setError(response.error || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbThree title={"Sign in"} pages={["Sign in"]} />

      {/* Reduced py-12 -> py-11, py-20 -> py-18 */}
      <section className="py-11 lg:py-18">
        {/* max-width reduced 1200->1080, 1600->1440 */}
        <div className="2xl:max-w-[1400px] w-full mx-auto px-8">
          {/* gap-16 -> gap-14, gap-32 -> gap-28 */}
          <div className="flex flex-col lg:flex-row gap-14 xl:gap-28">
            
            {/* LEFT SIDE: Sign In Form */}
            <div className="flex-1">
              {error && (
                <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 text-red-600 text-[12.6px] rounded">
                  {error}
                </div>
              )}

              {/* max-w-480 -> max-w-432 */}
              <form className="max-w-[432px]" onSubmit={handleSubmit}>
                <div className="mb-5.5">
                  <input
                    type="email"
                    placeholder="Email*"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // p-3 -> p-2.5, text-sm -> text-[12.6px]
                    className="w-full border border-gray-200 p-2.5 rounded bg-[#FDFDFD] text-[12.6px] outline-none focus:border-[#116DB2]"
                  />
                </div>

                <div className="mb-5.5">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password*"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 p-2.5 rounded bg-[#FDFDFD] text-[12.6px] outline-none focus:border-[#116DB2] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {/* Icon size 20 -> 18 */}
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-7">
                  <button
                    type="submit"
                    disabled={loading}
                    // px-12 -> px-11, py-3 -> py-2.5, text-sm -> text-[12.6px]
                    className={`inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
                    }`}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                  <label className="flex items-center gap-2 cursor-pointer text-[12.6px] font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-300"
                    />
                    Remember Me
                  </label>
                </div>

                <Link
                  href="#"
                  className="text-[#116DB2] text-[12.6px] font-bold pb-0.5"
                >
                  Forgot Password?
                </Link>
              </form>
            </div>

            {/* RIGHT SIDE: Call to Action */}
            {/* lg:w-450 -> lg:w-405 */}
            <div className="lg:w-[405px]">
              {/* text-3xl -> text-[27px], mb-8 -> mb-7 */}
              <h2 className="text-[27px] font-bold text-[#000000] mb-7">
                Not a member yet?
              </h2>
              <div className="mb-9">
                <p className="text-[12.6px] font-bold text-[#000000] mb-5.5 tracking-tight">
                  Not a member yet?
                </p>
                <Link
                  href="/signup"
                  // py-4 -> py-3.5
                  className="inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md w-full justify-center items-center"
                >
                  Sign Up
                </Link>
              </div>

              {/* space-y-8 -> space-y-7 */}
              <div className="space-y-7">
                <div className="flex flex-col">
                  <p className="text-[12.6px] font-bold text-black mb-1.5 uppercase">
                    Enjoy your product to the fullest :
                  </p>
                  {/* text-xs -> text-[10.8px] */}
                  <p className="text-[10.8px] text-gray-500 leading-relaxed font-medium">
                    Maximizing your LG product experience with helpful
                    information about all your registered products
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[12.6px] font-bold text-black mb-1.5 uppercase">
                    Let LG know how to reach you :
                  </p>
                  <p className="text-[10.8px] text-gray-500 leading-relaxed font-medium">
                    Managing your customer profile so LG knows how and when to
                    communicate with you
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[12.6px] font-bold text-black mb-1.5 uppercase">
                    Everything in one location :
                  </p>
                  <p className="text-[10.8px] text-gray-500 leading-relaxed font-medium">
                    A single account that allows for various interaction with LG
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signin;