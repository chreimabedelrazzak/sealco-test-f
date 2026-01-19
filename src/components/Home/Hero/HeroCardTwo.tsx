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
    <section className="relative w-full h-full min-h-[550px] md:min-h-[600px] 2xl:min-h-[800px] bg-[#F8F8F8] overflow-hidden flex flex-col justify-between">
  
  {/* CONTENT LAYER - Always on top */}
  <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-12 md:pt-0 md:h-full flex flex-col justify-center">
    <div className="w-full md:max-w-[550px] text-center md:text-left flex flex-col items-center md:items-start">
      <span className="block text-black font-semibold text-xl sm:text-4xl">{subtitle}</span>
      <h1 className="block text-black font-bold text-2xl sm:text-6xl mb-3">{title}</h1>
      <p className="text-lg text-black font-medium mb-6">{description}</p>
      <a href="#" className="bg-[#116DB2] text-white font-bold py-4 px-10 rounded-full hover:bg-[#AD003A] transition-all">
        {buttonText}
      </a>
    </div>
  </div>

  {/* IMAGE LAYER - Responsive positioning */}
  <div className="relative md:absolute inset-0 z-0 w-full h-[300px] md:h-full flex items-end justify-center md:justify-end">
    <img 
      src={image} 
      alt={title}
      className="w-full h-full object-contain object-bottom md:object-right-bottom max-w-[90%] md:max-w-[50%] lg:max-w-[60%]"
    />
  </div>

</section>
  );
}