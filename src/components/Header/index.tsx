"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import Account from "../svg/account";
import Cart from "../svg/cart";
import Globe from "../svg/globe";
import { useRouter } from "next/navigation";
import { menuService } from "@/services/menuService";
import { MenuDetails, MenuItem } from "@/types/Menu";
import Dropdown from "./Dropdown";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const router = useRouter();
  const [menuData_, setMenuData] = useState<MenuDetails | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navigationOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setNavigationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigationOpen]);

  const closeMenu = () => setNavigationOpen(false);

  useEffect(() => {
    menuService
      .getMenus()
      .then((data) => {
        const headerMenu = data.find((m) => m.name === "Header");
        if (headerMenu) {
          menuService.getMenuById(headerMenu.id).then(setMenuData);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    closeMenu();
  };

  // Safety first: Fallback to an empty array if data isn't loaded yet
  const buildMenuTree = (
    items: MenuItem[],
    parentId: number | null = null,
  ): any[] => {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        submenu: buildMenuTree(items, item.id), // Recursive call
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  // Usage inside component:
  const menuData = menuData_?.items || [];
  const structuredMenu = buildMenuTree(menuData, null);

  return (
    <header ref={menuRef} className="relative w-full bg-[#F8F8F8] z-[9999]">
      <div className="z:max-w-[1500px] mx-auto px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex justify-end items-center">
            {/* LEFT: LOGO */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative w-[180px] h-[100px] xl:w-[220px] mt-6">
                <Image
                  src="/images/logo/main-logo.png"
                  alt="Logo"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col-reverse items-end gap-y-3 h-full">
            {/* CENTER/RIGHT: NAVIGATION (Hidden on mobile, flex on desktop) */}
            <nav className="hidden xl:flex items-center flex-grow justify-start lg:ml-4">
              <ul className="flex items-center flex-wrap justify-end gap-4 2xl:gap-6">
                {structuredMenu.map((menuItem, index) => (
                  <React.Fragment key={menuItem.id}>
                    {/* Logic for the first separator after exactly 4 items */}
                    {index === 3 && (
                      <span className="text-[#676767] font-semibold mx-0">|</span>
                    )}

                    {/* Logic for every 3 items after the initial 4 */}
                    {index > 3 && (index - 3) % 3 === 0 && (
                      <span className="text-[#676767] font-semibold mx-0">|</span>
                    )}

                    <li className="whitespace-nowrap">
                      {/* If the item has children in its submenu, show Dropdown */}
                      {menuItem.submenu && menuItem.submenu.length > 0 ? (
                        <Dropdown menuItem={menuItem} stickyMenu={false} />
                      ) : (
                        <Link
                          href={
                            menuItem.customLink.startsWith("http")
                              ? menuItem.customLink
                              : `/${menuItem.customLink}`
                          }
                          className="text-[14px] 2xl:text-[15px] font-semibold text-[#676767] uppercase hover:text-[#116DB2] transition-colors leading-tight"
                        >
                          {menuItem.name}
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </nav>

            {/* RIGHT GROUP: Search + Icons */}
            <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
              {/* Search Bar */}
              <div className="hidden lg:flex relative w-[140px] 2xl:w-[180px]">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  value={searchQuery}
                  type="search"
                  placeholder="Search"
                  className="w-full rounded-full border border-[#EBEBEB] py-1 pl-4 pr-10 outline-none focus:border-[#116DB2] bg-white text-sm placeholder:text-[#D1D1D1] text-[#555555] font-medium"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                      fill="#343434"
                    />
                  </svg>
                </button>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={openCartModal}
                  className="relative group scale-90 md:scale-100"
                >
                  <Cart />
                  {product.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#116DB2] text-[9px] font-bold text-white">
                      {product.length}
                    </span>
                  )}
                </button>
                <Link href="/my-account" className="scale-90 md:scale-100">
                  <Account />
                </Link>
                <div className="hidden sm:block scale-90 md:scale-100">
                  <Globe />
                </div>

                {/* Mobile Hamburger */}
                <button
                  className="xl:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
                  onClick={() => setNavigationOpen(!navigationOpen)}
                >
                  <span
                    className={`block w-6 h-0.5 bg-[#333] transition-all ${navigationOpen ? "rotate-45 translate-y-1.5" : ""}`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-[#333] transition-all ${navigationOpen ? "opacity-0" : ""}`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-[#333] transition-all ${navigationOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {navigationOpen && (
          <div className="xl:hidden mt-4 border-t border-[#eee] py-4">
            <ul className="flex flex-col gap-4">
              {/* Mobile Search */}
              <li className="lg:hidden">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  value={searchQuery}
                  type="search"
                  placeholder="Search"
                  className="w-full rounded-full border border-[#EBEBEB] py-2 px-4 outline-none text-sm"
                />
              </li>
              {menuData_?.items?.map((menuItem) => (
                <li key={menuItem.id} onClick={closeMenu}>
                  <Link
                    href={`/${menuItem.customLink}`}
                    className="block text-sm font-bold text-[#676767] uppercase"
                  >
                    {menuItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;