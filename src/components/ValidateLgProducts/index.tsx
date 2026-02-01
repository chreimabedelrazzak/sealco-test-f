// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import BreadcrumbThree from "../Common/CartSidebarModal/BreadcrumbThree";
// import { validateProductService } from "@/services/validateProductService";
// import { ProductBarcodeCategory, BarcodeVerificationResult } from "@/types/validateProduct";
// import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

// export default function ValidateLgProduct() {
//   // State for data
//   const [categories, setCategories] = useState<ProductBarcodeCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [serialNumber, setSerialNumber] = useState<string>("");
//   const [result, setResult] = useState<BarcodeVerificationResult | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch categories on mount
//   useEffect(() => {
//     const fetchCats = async () => {
//       const data = await validateProductService.getCategories();
//       setCategories(data);
//     };
//     fetchCats();
//   }, []);

//   // Handle Manual Validation
//   const handleValidate = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!serialNumber) return;

//     setLoading(true);
//     const response = await validateProductService.verifySerialNumber(serialNumber);
//     setResult(response);
//     setLoading(false);
//   };

//   // Handle Image Upload & Scan
//   const handleImageScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const html5QrCode = new Html5Qrcode("reader");
//     try {
//       const result = await html5QrCode.scanFile(file, true);
//       setSerialNumber(result); // Set the scanned text to the input
//       // Optionally auto-trigger validation
//       const response = await validateProductService.verifySerialNumber(result);
//       setResult(response);
//     } catch (err) {
//       alert("Could not find a valid barcode in this image. Please try a clearer photo.");
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <BreadcrumbThree
//         title={"Validate LG Product's Serial Number"}
//         pages={["Validate LG Product's Serial Number"]}
//       />

//       {/* Hidden reader element for the library to use for processing */}
//       <div id="reader" className="hidden"></div>

//       <section className="py-7 2xl:max-w-[1500px] w-full mx-auto px-8">
//         <div className="">
//           <form className="flex flex-col" onSubmit={handleValidate}>

//             {/* CATEGORY SELECT SECTION */}
//             <div className="mb-7">
//               <label className="block text-[12.6px] font-bold text-black mb-3.5">
//                 Select a product category from the below list
//               </label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full lg:w-[360px] border border-gray-200 p-2.5 rounded bg-white text-[12.6px] outline-none focus:border-[#116DB2]"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>{cat.title}</option>
//                 ))}
//               </select>
//             </div>

//             {/* INSTRUCTIONAL IMAGE */}
//             <div className="flex flex-col items-start mb-7">
//               <div className="relative w-full max-w-[360px] aspect-[4/3] mb-5.5">
//                 <Image
//                   src="/images/validate/validate-product.png"
//                   alt="Serial number location guide"
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <p className="text-[12.6px] font-medium text-gray-500 leading-relaxed max-w-[540px]">
//                 Serial number label is located at the back of the product. You can also check
//                 for the serial number on the LG product box prior to purchase to
//                 make sure it is under Sealco warranty.
//               </p>
//             </div>

//             {/* SCAN BARCODE BUTTON - Using file input for both upload and mobile camera */}
//             <div className="mb-9">
//               <input
//                 type="file"
//                 accept="image/*"
//                 capture="environment" // Forces mobile to open camera directly
//                 className="hidden"
//                 ref={fileInputRef}
//                 onChange={handleImageScan}
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full lg:w-[360px] border border-gray-200 py-2.5 rounded-full font-bold text-black text-[12.6px] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                   <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-7z"/>
//                 </svg>
//                 Scan / Upload Serial Number
//               </button>
//             </div>

//             {/* DIVIDER */}
//             <div className="relative flex items-center w-full lg:w-[360px] mb-9">
//               <div className="flex-grow border-t border-gray-100"></div>
//               <span className="flex-shrink mx-3.5 text-[10.8px] font-bold text-gray-400 uppercase">Or</span>
//               <div className="flex-grow border-t border-gray-100"></div>
//             </div>

//             {/* MANUAL ENTRY SECTION */}
//             <div className="mb-9">
//               <label className="block text-[12.6px] font-bold text-black mb-3.5">
//                 Enter serial number manually
//               </label>
//               <input
//                 type="text"
//                 value={serialNumber}
//                 onChange={(e) => setSerialNumber(e.target.value)}
//                 placeholder="Enter serial number"
//                 className="w-full lg:w-[360px] border border-gray-200 p-2.5 rounded bg-white text-[12.6px] outline-none focus:border-[#116DB2]"
//               />
//             </div>

//             {/* VALIDATE BUTTON */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full lg:w-[360px] inline-flex justify-center items-center font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md disabled:bg-gray-400"
//               >
//                 {loading ? "Verifying..." : "Validate My LG Product"}
//               </button>
//             </div>

//             {/* RESPONSE MESSAGE */}
//             {result && (
//               <div className={`mt-6 w-full lg:w-[360px] p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
//                 <p className="font-bold">{result.message}</p>
//                 <p className="text-[12px]">Serial: {result.serialNumber}</p>
//               </div>
//             )}

//           </form>
//         </div>
//       </section>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import BreadcrumbThree from "../Common/CartSidebarModal/BreadcrumbThree";
import { validateProductService } from "@/services/validateProductService";
import {
  ProductBarcodeCategory,
  BarcodeVerificationResult,
} from "@/types/validateProduct";
import { Html5Qrcode } from "html5-qrcode";
import Tesseract from "tesseract.js";

export default function ValidateLgProduct() {
  const [categories, setCategories] = useState<ProductBarcodeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [result, setResult] = useState<BarcodeVerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await validateProductService.getCategories();
        setCategories(data);
        console.log(data, categories)
      } catch (err) {
        setErrorMessage("Failed to load categories.");
      }
    };
    fetchCats();
  }, []);

  const handleValidate = async (
    e?: React.FormEvent,
    overrideSerial?: string,
  ) => {
    if (e) e.preventDefault();
    const targetSerial = overrideSerial || serialNumber;

    if (!targetSerial) {
      setErrorMessage("Please enter or scan a serial number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response =
        await validateProductService.verifySerialNumber(targetSerial);
      setResult(response);
    } catch (err) {
      setErrorMessage("An error occurred while validating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImgFile = async (): Promise<File> => {
    if (!completedCrop || !imgRef.current)
      throw new Error("Please select the barcode area.");

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not create canvas context.");

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("Canvas is empty"));
          resolve(new File([blob!], "crop.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.95,
      );
    });
  };

  const processImageScan = async () => {
    setLoading(true);
    setStatusMessage("Scanning Barcode...");
    const html5QrCode = new Html5Qrcode("reader");
    try {
      const croppedFile = await getCroppedImgFile();
      try {
        // Step 1: Attempt Barcode Scan
        const barcodeResult = await html5QrCode.scanFile(croppedFile, true);
        setSerialNumber(barcodeResult);
        setShowModal(false);
        // AUTO VALIDATE after scan
        handleValidate(undefined, barcodeResult);
      } catch (barcodeErr) {
        // Step 2: Fallback to Tesseract OCR
        setStatusMessage("Reading Text...");
        const ocrResult = await Tesseract.recognize(croppedFile, "eng");
        const text = ocrResult.data.text.replace(/\s/g, "");
        const serialMatch = text.match(/[A-Z0-9]{12,15}/);

        if (serialMatch) {
          const detectedSerial = serialMatch[0];
          setSerialNumber(detectedSerial);
          setShowModal(false);
          // AUTO VALIDATE after OCR
          handleValidate(undefined, detectedSerial);
        } else {
          setShowModal(false);
          setErrorMessage(
            "No serial number detected. Try cropping closer to the text.",
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during scanning.");
    } finally {
      setLoading(false);
      setStatusMessage("");
      html5QrCode.clear();
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbThree
        title="Validate LG Product"
        pages={["Validate LG Product"]}
      />
      <div id="reader" className="hidden"></div>

      <section className="py-7 2xl:max-w-[1500px] w-full mx-auto px-8">
        <form className="flex flex-col" onSubmit={handleValidate}>
          <div className="mb-7">
            <label className="block text-[12.6px] font-bold text-black mb-3.5">
              Select a product category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full lg:w-[360px] border border-gray-200 p-2.5 rounded bg-white text-[12.6px] outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full max-w-[360px] aspect-[4/3] mb-7">
            <Image
              src="/images/validate/validate-product.png"
              alt="Serial Location"
              fill
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setImage(null);
              setShowModal(true);
              setErrorMessage(null);
            }}
            className="w-full lg:w-[360px] border border-gray-200 py-2.5 rounded-full font-bold text-black text-[12.6px] mb-9 hover:bg-gray-50 transition-colors"
          >
            Scan Serial Number Barcode
          </button>

          <div className="mb-9">
            <label className="block text-[12.6px] font-bold text-black mb-3.5">
              Enter serial number manually
            </label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Enter serial number"
              className="w-full lg:w-[360px] border border-gray-200 p-2.5 rounded bg-white text-[12.6px] focus:border-[#116DB2] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-[360px] font-semibold text-white text-[14px] rounded-[20px] bg-[#116DB2] py-3 shadow-md disabled:bg-gray-400 hover:bg-[#0e5a94] transition-all"
          >
            {loading && !showModal ? "Verifying..." : "Validate My LG Product"}
          </button>

          {/* Validation Results Display */}
          {result && (
            <div
              className={`mt-6 w-full lg:w-[360px] p-4 rounded-lg border-2 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-bold ${result.success ? "text-green-700" : "text-red-700"}`}
                >
                  {result.success ? "✓ Valid Product" : "✕ Validation Failed"}
                </span>
              </div>
              <p
                className={`text-[13px] ${result.success ? "text-green-600" : "text-red-600"}`}
              >
                {result.message}
              </p>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">
                Serial: {result.serialNumber}
              </p>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-4 w-full lg:w-[360px] p-3 bg-red-100 border border-red-200 text-red-700 text-[12px] rounded">
              {errorMessage}
            </div>
          )}
        </form>
      </section>

      {/* CROPPER MODAL */}
      {showModal && (
  /* 1. Added "p-4" to the overlay to provide a small gap on mobile edges */
  <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#000000]/70">
    
    <div className="relative w-full max-w-[45rem] border-[20px] border-[#ffffff]/50 max-h-full flex flex-col">
      
      <div className="bg-white px-6 py-4 overflow-y-auto">
        
        {/* Close Button - Changed to fixed or absolute relative to the white box */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-5 right-6 text-3xl text-gray-400 hover:text-black transition-colors z-10"
        >
          ✕
        </button>

        {/* Dual Logos (Sealco & LG) */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/images/logo/main-logo.png"
            alt="Sealco"
            className="h-16 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-[#000000] text-[24px] 2xl:text-[32px] font-bold text-center mb-5 tracking-tight">
          Scan Serial Number Barcode
        </h2>

        {/* Barcode Scan Area */}
        <div className="relative mx-auto md:max-w-[80%] h-[260px] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-repeat [background-image:linear-gradient(45deg,#f5f5f5_25%,transparent_25%,transparent_75%,#f5f5f5_75%,#f5f5f5),linear-gradient(45deg,#f5f5f5_25%,white_25%,white_75%,#f5f5f5_75%,#f5f5f5)] border border-[#eeeeee] mb-5 flex items-center justify-center overflow-hidden">
          {!image ? (
            <div className="flex flex-col items-center justify-center">
              <div className="relative inline-flex items-center justify-center p-2">
                <span className="absolute top-0 left-0 w-8 h-8 border-l-[3px] border-t-[3px] border-[#116DB2]" />
                <span className="absolute top-0 right-0 w-8 h-8 border-r-[3px] border-t-[3px] border-[#116DB2]" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-l-[3px] border-b-[3px] border-[#116DB2]" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-r-[3px] border-b-[3px] border-[#116DB2]" />

                <div className="relative flex flex-col items-center">
                  <div className="relative w-60 h-40">
                    <Image
                      src="/images/validate/barcode.png"
                      alt="Barcode"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#116DB2]"></div>
                <div className="bg-[#116DB2] text-white text-[14px] font-bold px-6 py-1 rounded shadow-sm tracking-tight">
                  Scan Me
                </div>
              </div>
            </div>
          ) : (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={image}
                alt="User scan"
                className="max-h-[240px] w-auto object-contain"
              />
            </ReactCrop>
          )}
        </div>

        {/* Main Buttons */}
        <div className="flex flex-wrap justify-center gap-5 mb-4">
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import Image
          </button>

          <button
            disabled={!image || loading}
            onClick={processImageScan}
            className={`inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md ${
              image && !loading
                ? "bg-[#116DB2] text-white"
                : "bg-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {loading ? "Validating..." : "Validate Barcode"}
          </button>
        </div>

        {/* Disclaimer Section */}
        <div className="pt-2">
          <p className="text-[14px] font-bold text-[#000000] mb-1 uppercase tracking-tight">
            DISCLAIMER
          </p>
          <p className="text-[12px] font-semibold text-[#000000] leading-[1.6]">
            If your phone camera doesn't capture the serial number barcode,
            you may type the serial number manually and click on Validate My
            LG Product.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
