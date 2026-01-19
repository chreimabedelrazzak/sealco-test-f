"use client";
import React, { useEffect } from "react";

interface FlixmediaProps {
  brand: string;
  mpn: string;
  ean?: string;
}

const SCRIPT_ID = "flixmedia-loader";

const FlixmediaLoader: React.FC<FlixmediaProps> = ({ brand, mpn, ean }) => {
  useEffect(() => {
    // 1. Validate inputs to prevent "undefined" appearing in API URLs 
    if (!mpn && !ean) {
      console.warn("Flixmedia Debug: No MPN or EAN provided. Aborting load.");
      return;
    }

    // 2. Credentials for LG Lebanon project [cite: 66, 239]
    const distributorId = "17555"; 
    const languageCode = "lb"; 

    // 3. Cleanup existing script for SPA navigation [cite: 319]
    const oldScript = document.getElementById(SCRIPT_ID);
    if (oldScript) oldScript.remove();

    // 4. Clear DIV containers to prevent content duplication [cite: 52]
    const minisite = document.getElementById("flix-minisite");
    const inpage = document.getElementById("flix-inpage");
    if (minisite) minisite.innerHTML = "";
    if (inpage) inpage.innerHTML = "";

    // 5. Create and Inject the script [cite: 40, 56]
    const flixScript = document.createElement("script");
    flixScript.id = SCRIPT_ID;
    flixScript.async = true;
    flixScript.src = "https://media.flixfacts.com/js/loader.js";

    // Required Attributes [cite: 41, 42, 43, 44, 45]
    flixScript.setAttribute("data-flix-distributor", distributorId);
    flixScript.setAttribute("data-flix-language", languageCode);
    flixScript.setAttribute("data-flix-brand", brand);
    
    // Ensure values are trimmed and not "undefined" strings 
    if (mpn) flixScript.setAttribute("data-flix-mpn", mpn.trim());
    if (ean) flixScript.setAttribute("data-flix-ean", ean.trim());

    // Link to containers [cite: 46, 47, 53, 54]
    flixScript.setAttribute("data-flix-button", "flix-minisite");
    flixScript.setAttribute("data-flix-inpage", "flix-inpage");

    // 6. Debug Callbacks [cite: 153, 158]
    flixScript.onload = () => {
      if (window.flixJsCallbacks) {
        window.flixJsCallbacks.setLoadCallback(() => console.log("Flixmedia: Inpage available"), "inpage");
        window.flixJsCallbacks.setLoadCallback(() => console.warn("Flixmedia: No content found (NOSHOW)"), "noshow");
      }
    };

    document.head.appendChild(flixScript);

    return () => {
      const script = document.getElementById(SCRIPT_ID);
      if (script) script.remove();
    };
  }, [brand, mpn, ean]);

  return (
    <div className="flix-container mt-10">
      <div id="flix-minisite" />
      <div id="flix-inpage" />
    </div>
  );
};

export default FlixmediaLoader;

declare global {
  interface Window {
    flixJsCallbacks: {
      setLoadCallback: (callback: () => void, type: "inpage" | "minisite" | "noshow") => void;
    };
  }
}