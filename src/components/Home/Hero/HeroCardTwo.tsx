"use client";

interface HeroCard {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
}

export default function HeroCardTwo({
  title,
  subtitle,
  buttonText,
  description,
  image,
}: HeroCard) {
  return (
    <section className="mb-20 md:mb-10 relative w-full h-full min-h-[500px] md:min-h-[600px] 2xl:min-h-[800px] bg-[#F8F8F8] overflow-hidden flex flex-col md:flex-row items-center">
      
      {/* CONTENT LAYER - Moved up in the DOM so it renders first on mobile */}
      <div className="relative z-10 w-full 2xl:max-w-[1600px] mx-auto px-6 xl:px-8 flex flex-col justify-start pt-16 md:pt-0 md:h-full md:justify-center">
        <div className="px-4 w-full md:max-w-[550px] lg:max-w-[500px] text-center md:text-left flex flex-col items-center md:items-start">
          <span className="block text-[#000000] sm:leading-[45px] font-semibold text-xl sm:text-4xl axl:text-6xl">
            {title}
          </span>
          <span className="block text-[#000000] font-semibold text-xl sm:text-3xl mb-3">
            {subtitle}
          </span>
          <p className="text-lg text-[#000000] font-medium mb-3">
            {description}
          </p>
          <a
            href="#"
            className="inline-flex font-bold text-white text-sm md:text-base rounded-full bg-[#116DB2] py-4 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            {buttonText}
          </a>
        </div>
      </div>

      {/* IMAGE LAYER 
          Changed to 'relative' and 'h-[300px]' on mobile to force it below text.
          Kept 'md:absolute' and 'md:inset-0' to maintain desktop design.
      */}
      <div 
        className="relative md:absolute md:inset-0 z-0 w-full h-[350px] sm:h-[450px] md:h-full mt-auto max-w-[1400px] 2xl:max-w-[1600px] mx-auto bg-no-repeat 
                   bg-bottom bg-contain 
                   md:bg-right-bottom md:bg-contain transition-all duration-700"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center bottom', /* Forces image to the very bottom pixel */
        }}
      />

    </section>
  );
}