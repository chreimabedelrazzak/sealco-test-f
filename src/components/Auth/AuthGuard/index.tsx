"use client"; // This must be at the top

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import from navigation
import { isTokenExpired } from "@/utils/auth";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname(); // This detects route changes in App Router

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");

      if (token && isTokenExpired(token)) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("customerId");
        localStorage.removeItem("userFullName");
        
        // Use window.location for a full refresh to clear all state,
        // or router.push('/signin') for a soft redirect.
        window.location.href = "/signin";
      }
    };

    checkAuth();
  }, [pathname]); // Re-runs whenever the URL changes

  return <>{children}</>;
};