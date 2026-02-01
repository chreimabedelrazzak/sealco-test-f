// "use client";

// interface HeroCard {
//   title: string;
//   subtitle: string;
//   description: string;
//   buttonText: string;
//   image: string;
//   link: string;
// }

// export default function HeroCardThree({
//   title,
//   subtitle,
//   buttonText,
//   description,
//   image,
//   link,
// }: HeroCard) {
//   return (
//     <div className="relative w-full h-[130vh] lg:130vh my-8 overflow-hidden">
//       {/* BACKGROUND IMAGE */}
//       <div
//         className="
//           absolute inset-0
//           bg-no-repeat bg-cover
//           z-0
//         "
//         style={{ backgroundImage: `url(${image})` }}
//       ></div>

//       {/* 🔥 BLACK OVERLAY ABOVE IMAGE */}
//       <div className="absolute inset-0 bg-black/40 z-[1]"></div>

//       {/* POLYGON SHAPE */}
//       <div
//         className="
//           absolute inset-0
//           bg-[#F8F8F8]
//           z-10
// [clip-path:polygon(0_10%,100%_100%,0_100%)]
// 2xl:[clip-path:polygon(0_50%,100%_100%,0_100%)]
//         "
//       ></div>

//       {/* TEXT + BUTTON */}
//       <div className="absolute inset-0 z-20">
//         <div className="relative 2xl:max-w-[1600px] mx-auto h-full w-full flex items-end xl:px-8 px-6 pb-[3%]">
//           <div className="max-w-[540px] px-4">
//             <span className="block text-[#000000] sm:leading-[45px] font-semibold text-xl xl:text-5xl">
//               {title}
//             </span>

//             <span className="block text-[#000000] font-semibold text-xl sm:text-5xl mb-3">
//               {subtitle}
//             </span>

//             <p className="text-lg text-[#000000] font-medium mb-3">
//               {description}
//               <span className="text-[#116DB2]">
//                 <a href={`mailto:${link}`}> {link}</a>
//               </span>
//             </p>

// <a
//   href="#"
//   className="inline-flex font-bold text-white text-sm md:text-base rounded-3xl bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
// >
//   {buttonText}
// </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

interface HeroCard {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
}

export default function HeroCardThree({
  title,
  subtitle,
  buttonText,
  description,
  image,
  link,
}: HeroCard) {
  return (
    <div className="flex justify-center items-center min-h-[740px] 2xl:min-h-[760px]">
      <div className="w-full z:max-w-[1500px] min-h-[740px] 2xl:min-h-[760px]">
        <div className="relative w-full h-auto md:my-8 overflow-hidden bg-white ">
          {/* 1. PHYSICAL IMAGE: This defines the parent's height */}
          <img
            src={image}
            alt={title}
            className="w-full h-auto block object-cover min-h-[740px] 2xl:min-h-[760px]"
          />

          {/* 2. OVERLAY: Semi-transparent black layer */}
          <div className="absolute inset-0 bg-black/20 z-[1]"></div>

          {/* 3. POLYGON SHAPE: Positioned absolutely over the image */}
          <div
            className="
        hidden
        md:block
        absolute
           inset-0
          bg-[#F3F4F7]
          z-10
          [clip-path:polygon(0_10%,100%_120%,100%_100%,0_100%)]
          md:[clip-path:polygon(0_30%,100%_85%,100%_100%,0_100%)]
          2xl:[clip-path:polygon(0_40%,100%_100%,0_100%)] 
        "
          >
            {/* 4. CONTENT LAYER: Flexbox used to pin text to the bottom */}
            <div className="absolute inset-0 z-20 flex items-end ">
              <div className="acontainer w-full z:max-w-[1500px]  px-8 mx-auto pb-14">
                <div className="qmax-w-[400px]">
                  <div className="mb-4">
                    <h1 className="text-[#000000] block text-[38px] 2xl:text-[40px] font-bold leading-tight">
                      {title}
                    </h1>
                    <h2 className="block text-[#000000] text-[38px] 2xl:text-[40px] font-bold pb-3 leading-tight">
                      {subtitle}
                    </h2>
                  </div>

                  <p className=" text-[#000000] text-[21px] 2xl:text-[23px] font-semibold mb-6 max-w-[680px]">
                    {description}{" "}
                    <a
                      href={`mailto:${link}`}
                      className="text-[#116DB2] hover:underline transition-colors"
                    >
                      {link}
                    </a>
                  </p>

                  <a
                    href="#"
                    className="inline-flex font-semibold text-white text-[14px] 2xl:text-[15px] rounded-[20px] bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md"
                  >
                    {buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end md:hidden bg-[#F3F4F7] pt-8 mb-20">
          <div className="acontainer w-full z:max-w-[1500px] px-8 mx-auto pb-8 lg:pb-6 ">
            <div className="amax-w-[400px] px-8">
              <div className="mb-4">
                <h1 className="text-[#000000] text-3xl md:text-3xl 2xl:text-6xl font-bold leading-tight">
                  {title}
                </h1>
                <h2 className="text-[#000000] text-3xl md:text-3xl 2xl:text-6xl font-bold leading-tight">
                  {subtitle}
                </h2>
              </div>

              <p className="text-sm md:text-lg text-[#000000] font-bold mb-6 max-w-[480px]">
                {description}{" "}
                <a
                  href={`mailto:${link}`}
                  className="text-[#116DB2] hover:underline transition-colors"
                >
                  {link}
                </a>
              </p>

              <a
                href="#"
                className="inline-flex font-bold text-white text-sm md:text-base rounded-3xl bg-[#116DB2] py-3 px-10 hover:bg-[#AD003A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                {buttonText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    /* h-auto allows the container to grow with the image height */
  );
}
