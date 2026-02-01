"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { menuService } from "@/services/menuService";

interface MenuItem {
  id: number;
  parentId: number | null;
  name: string;
  customLink: string;
  displayOrder: number;
}

interface MenuData {
  id: number;
  name: string;
  items: MenuItem[];
}

export default function FooterTwo() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    // Assuming menuService is available globally or imported
    menuService
      .getMenus()
      .then((data: any[]) => {
        const footerMenu = data.find((m) => m.name === "Footer");
        if (footerMenu) {
          menuService.getMenuById(footerMenu.id).then((res: MenuData) => {
            setMenuData(res);
          });
        }
      })
      .catch(() => {});
  }, []);

  // Transformation Logic: Group children under parents
  const renderColumns = () => {
    if (!menuData) return null;

    // 1. Get all root elements (Titles)
    const parents = menuData.items
      .filter((item) => item.parentId === null)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return parents.map((parent, index) => {
      // 2. Find children for this parent
      const children = menuData.items
        .filter((item) => item.parentId === parent.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const isLastInRow = (index + 1) % 6 === 0;
      const isFirstInRow = index % 6 === 0;

      return (
        <div
          key={parent.id}
          className={` text-start border-[#E8E8E8] p-12 pt-10 ${isFirstInRow ? "pl-0" : "pl-10 "} ${
            !isLastInRow ? "lg:border-r" : ""
          }`}
        >
          <h3 className="font-bold text-[16px] text-[#000000] mb-4">
            {parent.name}
          </h3>
          <div className="flex flex-col gap-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="text-gray-700 text-sm font-semibold leading-relaxed pl-4"
              >
                <a
                  href={
                    child.customLink.startsWith("/")
                      ? child.customLink
                      : `/${child.customLink}`
                  }
                >
                  {child.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <footer className="bg-white border-t border-[#E8E8E8] w-full mt-5 border-b">
        <div className=" 2xl:max-w-[1500px] mx-auto px-8">
          {/* Top Section: Navigation Grid */}
          <div className="">
            {/* Use mx-auto to center the container, but px-0 to ensure content starts at the edge */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {renderColumns()}
            </div>
          </div>

          {/* Bottom Section: Copyright & Socials */}
        </div>
      </footer>
      <div className="py-6 bg-white 2xl:max-w-[1600px] mx-auto px-6 xl:px-8">
        {/* Aligning the footer bottom with the grid above */}
        <div className=" flex flex-col md:flex-row gap-5 items-center justify-between">
          <p className="text-gray-700 text-[11px] font-medium leading-relaxed">
            Copyright &copy; {year} Sealco LG. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex gap-4 mr-4">
              <a
                href="/careers"
                className="text-[#6E6E6E] hover:text-black font-medium text-[11px]"
              >
                Careers
              </a>
              <a
                href="/faq"
                className="text-[#6E6E6E] hover:text-black font-medium text-[11px]"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-[#6E6E6E] hover:text-black font-medium text-[11px]"
              >
                Press Release
              </a>
              <a
                href="#"
                className="text-[#6E6E6E] hover:text-black font-medium text-[11px]"
              >
                Terms and Conditions
              </a>
            </div>

            <div className="flex items-center gap-2">
              {[
                "insta",
                "tiktok",
                "linkedin",
                "x",
                "pinterest",
                "facebook",
                "youtube",
              ].map((social) => (
                <a key={social} href="#" aria-label={social}>
                  <Image
                    src={`/images/social/${social}.png`}
                    alt={social}
                    width={28}
                    height={28}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
