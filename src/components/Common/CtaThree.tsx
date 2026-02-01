"use client";

import Image from "next/image";

interface SubItem {
  title: string;
  description: string;
}

interface Feature {
  img: string;
  title: string;
  items: SubItem[];
}

interface CtaThreeProps {
  title: string;
  features: Feature[];
  paragraphs: String[];
}

export default function CtaThree({
  title,
  features,
  paragraphs,
}: CtaThreeProps) {
  return (
    <section className="bg-[#FFFFFF] pt-16 ">
      <div className="2xl:max-w-[1500px] mx-auto px-8">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-[#000000] mb-8 text-start apx-4">
          {title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 apx-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-start text-start"
            >
              {/* Image */}
              <div className="h-[5rem] flex flex-col items-start justify-center">
                <Image
                  src={feature.img}
                  alt="Feature icon"
                  width={50}
                  height={50}
                />
              </div>
              <h3 className="font-bold text-xl text-[#000000] mb-4">
                {feature.title}
              </h3>

              {/* Items (title + description) */}
              <div className="space-y-4">
                {feature.items.map((sub, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-[16px] text-[#000000] mb-1">
                      {sub.title}
                    </h3>
                    <p className="text-gray-700 text-sm font-semibold leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Paragraph */}
        {/* CHANGE THE LINE BELOW FROM <p> TO <div> */}
        <div className="text-gray-700 text-base leading-relaxed mt-16">
          {paragraphs.map((p, idx) => (
            <div key={idx} className="pb-6">
              <p className="text-gray-700 text-[11px] font-medium leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
