"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import shopData from "../Shop/shopData";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import Image from "next/image";
import CategoryHero from "../Common/CategoryHero";
import { categoryService } from "@/services/categoryService";
import { CategoryDetails, CategoryProduct } from "@/types/Category";
import ChildCategoryCarousel from "../ChildCategoryCarousels";
import BreadCrumbBanner from "../Common/BreadCrumbBanner";
import { AvailableFilter } from "@/types/Category";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Props {
  slug: string;
}

const ShopWithSidebar = ({ slug }: Props) => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<AvailableFilter[]>(
    [],
  );
  const [selectedSubCatIds, setSelectedSubCatIds] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string[]>
  >({});

  // --- Price Range States ---
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [debouncedRange, setDebouncedRange] = useState<[number, number]>([
    0, 5000,
  ]);
  const [serverPriceLimits, setServerPriceLimits] = useState({
    min: 0,
    max: 5000,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const observerTarget = useRef(null);

  // 1. Debounce Price Slider
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update debounced range if the range has actually changed
      if (
        debouncedRange[0] !== priceRange[0] ||
        debouncedRange[1] !== priceRange[1]
      ) {
        setDebouncedRange(priceRange);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const catString = selectedSubCatIds.join(",");
  const attrString = useMemo(() => {
    return Object.entries(selectedAttributes)
      .filter(([_, values]) => values.length > 0)
      .map(([key, values]) => `${key}:${values.join(",")}`)
      .join("|");
  }, [selectedAttributes]);

  // 2. Initial Category Fetch
  useEffect(() => {
    categoryService.getCategoryBySlug(slug).then((data) => {
      if (data) setCategory(data);
    });
  }, [slug]);

  // 3. Fetch Products
  const fetchProducts = async (
    pageNum: number,
    isNewFilter: boolean = false,
  ) => {
    if (!category?.id || (loading && !isNewFilter)) return;
    setLoading(true);
    try {
      const res = await categoryService.getProductsByCategoryId(
        category.id,
        pageNum,
        12,
        catString,
        attrString,
        debouncedRange[0],
        debouncedRange[1],
      );

      setProducts((prev) =>
        isNewFilter ? res.items : [...prev, ...res.items],
      );
      setAvailableFilters(res.availableFilters);
      setHasMore(res.items.length === 12);

      // Update server price limits from API response
      if (res.priceRange) {
        const newMin = res.priceRange.min;
        const newMax = res.priceRange.max;
        setServerPriceLimits({ min: newMin, max: newMax });

        // Reset price range to server limits only on initial load
        if (isInitialLoad) {
          setPriceRange([newMin, newMax]);
          setDebouncedRange([newMin, newMax]);
          setIsInitialLoad(false);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(true);
    } finally {
      setLoading(false);
      if (isNewFilter) setInitialLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    if (category?.id) {
      setPage(1); // Reset to first page when filters change
      fetchProducts(1, true);
    }
  }, [category?.id, catString, attrString, debouncedRange]);

  // Infinite scroll for next pages
  useEffect(() => {
    if (page > 1 && category?.id) fetchProducts(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const toggleAttribute = (name: string, value: string) => {
    setSelectedAttributes((prev) => {
      const currentValues = prev[name] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: nextValues };
    });
  };

  const toggleCategory = (id: number) => {
    setSelectedSubCatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Handle price range change
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      const [min, max] = value as [number, number];
      // Ensure min doesn't exceed max and vice versa
      if (min <= max) {
        setPriceRange([min, max]);
      }
    }
  };

  // Reset price range to server limits
  const resetPriceRange = () => {
    setPriceRange([serverPriceLimits.min, serverPriceLimits.max]);
  };

  // Custom handle styles
  const handleStyles: React.CSSProperties = {
    width: 18,
    height: 18,
    marginTop: -7,
    backgroundColor: "#fff",
    border: "2px solid #2563eb",
    borderRadius: "50%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    opacity: 1,
  };

  return (
    <div className="bg-white">
      <Breadcrumb title={category?.name} pages={[`${category?.name}`]} />
      <ChildCategoryCarousel categories={category?.subCategories} />
      <CategoryHero banners={category?.banners} />

      <section className="pb-20 border-t border-gray-200 pt-10 ">
        <div className="max-w-[1200px] 2xl:max-w-[1600px] px-4 w-full mx-auto">
          {/* Top Bar Filter Toggle & Sort */}
          <div className="flex items-center justify-between mb-8 border-b border-[#E2E2E2] pb-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setProductSidebar(true)}
                className="flex items-center gap-2 font-bold text-sm uppercase"
              >
                {/* <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                </svg> */}
                Filter
              </button>
              <span className="text-gray-500 text-sm font-medium">
                {products.length} Results
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold">Sort:</span>
              <CustomSelect options={[{ label: "Newest", value: "new" }]} />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-10">
            <aside
              className={`xl:w-[280px] w-full ${productSidebar ? "block" : "hidden xl:block"}`}
            >
              <div className="space-y-8 sticky top-24">
                {/* Price Range */}
                <div className="border-b border-slate-100 pb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Price Range
                    </h3>
                    <button
                      onClick={resetPriceRange}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="px-2">
                    <Slider
                      range
                      min={serverPriceLimits.min}
                      max={serverPriceLimits.max}
                      value={priceRange}
                      onChange={handlePriceChange}
                      disabled={loading}
                      styles={{
                        rail: {
                          backgroundColor: "#f1f5f9",
                          height: 4,
                          borderRadius: 999,
                        },
                        track: {
                          backgroundColor: "#2563eb",
                          height: 4,
                          borderRadius: 999,
                        },
                        handle: handleStyles,
                      }}
                    />

                    {/* Price labels */}
                    <div className="mt-8 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                          Min Price
                        </p>
                        <p className="mt-1 text-base font-bold text-[#2563eb]">
                          ${priceRange[0].toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                          Max Price
                        </p>
                        <p className="mt-1 text-base font-bold text-[#2563eb]">
                          ${priceRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Category Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-bold text-sm uppercase mb-4">Category</h3>
                  <ul className="space-y-3">
                    {category?.subCategories.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#a50034]"
                          checked={selectedSubCatIds.includes(sub.id)}
                          onChange={() => toggleCategory(sub.id)}
                        />
                        <span
                          className={
                            selectedSubCatIds.includes(sub.id)
                              ? "font-bold"
                              : ""
                          }
                        >
                          {sub.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Attribute Filters from API */}
                {availableFilters.map((filter) => (
                  <div
                    key={filter.name}
                    className="border-b border-gray-200 pb-6"
                  >
                    <h3 className="font-bold text-sm uppercase mb-4">
                      {filter.name}
                    </h3>
                    {filter.name.toLowerCase() === "color" ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {filter.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => toggleAttribute(filter.name, val)}
                            title={val}
                            className={`
        group flex items-center justify-center 
        w-7 h-7 rounded-md border bg-white transition-all
        ${
          selectedAttributes[filter.name]?.includes(val)
            ? "border-blue-500 shadow-sm scale-105" // Change blue-500 to your preferred accent color
            : "border-[#E1E1E1]"
        }
      `}
                          >
                            <div
                              className="w-[18px] h-[18px] rounded-[3px]"
                              style={{
                                backgroundColor: val.startsWith("#")
                                  ? val
                                  : "transparent",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {filter.values.map((val) => (
                          <li
                            key={val}
                            className="flex items-center gap-3 text-sm"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-[#a50034]"
                              checked={
                                selectedAttributes[filter.name]?.includes(
                                  val,
                                ) || false
                              }
                              onChange={() => toggleAttribute(filter.name, val)}
                            />
                            <span>{val}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              {initialLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-600">
                    Error loading products. Please try again.
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">
                    No products found with the selected filters.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12`}
                  >
                    {products.map((item, key) => (
                      <SingleGridItem item={item} key={key} />
                    ))}
                  </div>

                  {/* --- The Sentinel --- */}
                  <div
                    ref={observerTarget}
                    className="w-full h-20 flex items-center justify-center mt-10"
                  >
                    {loading && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 font-medium">
                          Loading more products...
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopWithSidebar;
