"use client";

import Image from "next/image";

interface Feature {
  img: string;
  title: string;
  description: string;
}

interface CTASectionProps {
  title: string;
  features: Feature[];
}

export default function CtaTwo({ title, features }: CTASectionProps) {
  return (
    <section className="bg-[#F8F8F8] py-12">
      <div className=" z:max-w-[1500px] mx-auto px-8">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-[#000000] mb-8 text-start apx-4">
          {title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-start text-center"
            >
              {/* Image */}
              <div className="h-[7rem] flex flex-col items-center justify-center">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={50}
                  height={50}
                  className=""
                />
              </div>

              {/* Item Title */}
              <h3 className="font-bold text-xl text-[#000000] mb-2 uppercase">
                {item.title}
              </h3>

              {/* Description */}
              <div className="max-w-[200px]">
                <p className="text-gray-700 text-sm font-sm leading-relaxed ">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
