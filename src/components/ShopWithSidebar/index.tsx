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
  const [availableFilters, setAvailableFilters] = useState<AvailableFilter[]>([]);
  const [selectedSubCatIds, setSelectedSubCatIds] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [debouncedRange, setDebouncedRange] = useState<[number, number]>([0, 5000]);
  const [serverPriceLimits, setServerPriceLimits] = useState({ min: 0, max: 5000 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const observerTarget = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedRange[0] !== priceRange[0] || debouncedRange[1] !== priceRange[1]) {
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

  useEffect(() => {
    categoryService.getCategoryBySlug(slug).then((data) => {
      if (data) setCategory(data);
    });
  }, [slug]);

  const fetchProducts = async (pageNum: number, isNewFilter: boolean = false) => {
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

      setProducts((prev) => (isNewFilter ? res.items : [...prev, ...res.items]));
      setAvailableFilters(res.availableFilters);
      setHasMore(res.items.length === 12);

      if (res.priceRange) {
        const newMin = res.priceRange.min;
        const newMax = res.priceRange.max;
        setServerPriceLimits({ min: newMin, max: newMax });
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

  useEffect(() => {
    if (category?.id) {
      setPage(1);
      fetchProducts(1, true);
    }
  }, [category?.id, catString, attrString, debouncedRange]);

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

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      const [min, max] = value as [number, number];
      if (min <= max) setPriceRange([min, max]);
    }
  };

  const resetPriceRange = () => {
    setPriceRange([serverPriceLimits.min, serverPriceLimits.max]);
  };

  // Decreased handles by ~10% (18px -> 16px)
  const handleStyles: React.CSSProperties = {
    width: 16,
    height: 16,
    marginTop: -6,
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

      {/* Reduced pb-20 to pb-18, pt-10 to pt-9 */}
      <section className="pb-18  apt-9">
        {/* Adjusted 2xl max-width and px-8 to px-7 */}
        <div className="2.5xl:max-w-[1500px] px-8 w-full mx-auto">
          {/* mb-8 to mb-7, pb-4 to pb-3.5 */}
          <div className="flex items-center justify-between mb-7 border-b border-[#E2E2E2] py-3.5">
            <div className="flex items-center gap-7">
              <button
                onClick={() => setProductSidebar(true)}
                className="flex items-center gap-2 font-bold text-[12.6px] uppercase"
              >
                Filter
              </button>
              <span className="text-gray-500 text-[12.6px] font-medium">
                {products.length} Results
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-[12.6px] font-bold">Sort:</span>
              <CustomSelect options={[{ label: "Newest", value: "new" }]} />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-9">
            <aside
              className={`xl:w-[252px] w-full ${productSidebar ? "block" : "hidden xl:block"}`}
            >
              <div className="space-y-7 sticky top-20">
                <div className="border-b border-slate-100 pb-9">
                  <div className="flex justify-between items-center mb-5.5">
                    <h3 className="font-bold text-[12.6px] text-[#000000] mb-3.5">
                      Price Range
                    </h3>
                    <button
                      onClick={resetPriceRange}
                      className="text-[10.8px] text-blue-600 hover:text-blue-800 font-medium"
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
                        rail: { backgroundColor: "#f1f5f9", height: 3.5, borderRadius: 999 },
                        track: { backgroundColor: "#2563eb", height: 3.5, borderRadius: 999 },
                        handle: handleStyles,
                      }}
                    />

                    <div className="mt-7 flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                          Min Price
                        </p>
                        <p className="mt-1 text-[14.4px] font-bold text-[#2563eb]">
                          ${priceRange[0].toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                          Max Price
                        </p>
                        <p className="mt-1 text-[14.4px] font-bold text-[#2563eb]">
                          ${priceRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-5.5">
                  <h3 className="font-bold text-[12.6px] text-[#000000] mb-3.5">Category</h3>
                  <ul className="space-y-2.5">
                    {category?.subCategories.map((sub) => (
                      <li key={sub.id} className="flex items-center gap-2.5 text-[12.6px]">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-[#a50034]"
                          checked={selectedSubCatIds.includes(sub.id)}
                          onChange={() => toggleCategory(sub.id)}
                        />
                        <span className={selectedSubCatIds.includes(sub.id) ? "font-bold" : ""}>
                          {sub.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {availableFilters.map((filter) => (
                  <div key={filter.name} className="border-b border-gray-200 pb-5.5">
                    <h3 className="font-bold text-[12.6px] text-[#000000] mb-3.5">{filter.name}</h3>
                    {filter.name.toLowerCase() === "color" ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {filter.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => toggleAttribute(filter.name, val)}
                            title={val}
                            className={`group flex items-center justify-center w-6 h-6 rounded-md border bg-white transition-all ${
                              selectedAttributes[filter.name]?.includes(val)
                                ? "border-blue-500 shadow-sm scale-105"
                                : "border-[#E1E1E1]"
                            }`}
                          >
                            <div
                              className="w-[16px] h-[16px] rounded-[3px]"
                              style={{
                                backgroundColor: val.startsWith("#") ? val : "transparent",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2.5">
                        {filter.values.map((val) => (
                          <li key={val} className="flex items-center gap-2.5 text-[12.6px]">
                            <input
                              type="checkbox"
                              className="w-3.5 h-3.5 accent-[#a50034]"
                              checked={selectedAttributes[filter.name]?.includes(val) || false}
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

            <main className="flex-1">
              {initialLoading ? (
                <div className="flex justify-center items-center h-56">
                  <div className="w-7 h-7 border-[3.5px] border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-18">
                  <p className="text-red-600 text-[14.4px]">Error loading products.</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-18">
                  <p className="text-gray-500 text-[14.4px]">No products found.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-11">
                    {products.map((item, key) => (
                      <SingleGridItem item={item} key={key} />
                    ))}
                  </div>
                  <div ref={observerTarget} className="w-full h-18 flex items-center justify-center mt-9">
                    {loading && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 border-[3.5px] border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[12.6px] text-gray-500 font-medium">Loading...</p>
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