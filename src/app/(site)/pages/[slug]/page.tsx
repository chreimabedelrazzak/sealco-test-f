import { pageService } from "@/services/pageService";
import { notFound } from "next/navigation";
import Link from "next/link";
import BreadCrumbBanner from "@/components/Common/BreadCrumbBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://localhost:49206";

export default async function DynamicCmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await pageService.getBySlug(slug);

  if (!page) {
    notFound();
  }

  // Breadcrumb array based on the page name
  const breadcrumbPages = [page.name];

  // Hero item configuration using the thumbnail image
  const heroItem = {
    imageUrl: page.thumbnailImageUrl
      ? `${BASE_URL}${page.thumbnailImageUrl}`
      : null,
    caption: page.name,
    subCaption: page.metaDescription || "",
    videoUrl: null, // Placeholder if you add video support later
  };

  // Fix internal images in the body text
  const formattedBody = page.body.replace(
    /src="\/images\//g,
    `src="${BASE_URL}/images/`,
  );

  return (
    <main>
      {/* Dynamic Breadcrumb and Hero Section */}
      <div className="overflow-hidden">
        <div className="border-t border-gray-3">
          <div className="w-full 2xl:max-w-[1500px] mx-auto px-8 pb-4 pt-4 axl:pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <ul className="flex items-center gap-2 ">
                <li className="text-sm hover:text-[#116DB2]">
                  <Link href="/">Home /</Link>
                </li>

                {breadcrumbPages.map((p, key) => (
                  <li
                    className="text-sm font-regular last:text-[#116DB2] capitalize"
                    key={key}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Media Display Logic */}
          <div className="relative">
            {heroItem.videoUrl ? (
              <div className="w-full h-[300px] overflow-hidden">
                <video
                  src={heroItem.videoUrl}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <BreadCrumbBanner
                image={
                  heroItem.imageUrl || "/images/categories/category-banner.jpg"
                }
              />
            )}

            {/* Caption Overlay */}
            {(heroItem.caption || heroItem.subCaption) && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full 2xl:max-w-[1500px] mx-auto px-8 h-full flex flex-col justify-end pb-28 2xl:pb-40">
                  {heroItem.caption && (
                    <h1 className="text-[60px] 2xl:text-[66px] font-bold text-white leading-tight">
                      {heroItem.caption}
                    </h1>
                  )}
                  {heroItem.subCaption && (
                    <p className="text-lg text-white mt-2">
                      {heroItem.subCaption}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main CMS Body Content */}
      <section className="2xl:max-w-[1500px] mx-auto px-8 py-12">
        <div className="cms-content-wrapper prose max-w-none">
          <div
            className="prose prose-lg max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: formattedBody }}
          />
        </div>
      </section>
    </main>
  );
}
