import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const foodQuery = await payload.find({
    collection: "food-vendors",
    limit: 100,
  });

  return foodQuery.docs.map((item) => ({
    id: String(item.id),
  }));
}

export default async function FoodDetailPage({ params }: Props) {
  const { id } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const vendor = await payload.findByID({
    collection: "food-vendors",
    id: Number(id),
    depth: 1,
  });

  if (!vendor) {
    notFound();
  }

  const sponsorsQuery = await payload.find({
    collection: "sponsors",
    limit: 50,
    sort: "order",
  });

  const sponsors = sponsorsQuery.docs.map((s) => ({
    id: s.id,
    name: s.name,
    logo: typeof s.logo === "object" ? s.logo : null,
    url: s.url,
  }));

  const imageUrl =
    typeof vendor.image === "object" && vendor.image?.url
      ? vendor.image.url
      : null;

  const tagLabels: Record<string, string> = {
    food: "フード",
    sweets: "スイーツ",
    alcohol: "酒",
    "food-truck": "キッチンカー",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-bold text-4xl">{vendor.name}</h1>
          {vendor.tags && vendor.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {vendor.tags.map((tag) => (
                <span
                  className="rounded-full bg-white/20 px-3 py-1 text-sm"
                  key={tag}
                >
                  {tagLabels[tag] || tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {imageUrl && (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  alt={vendor.name}
                  className="object-cover"
                  fill
                  src={imageUrl}
                />
              </div>
            )}
            <div className="p-8">
              {/* Menu */}
              {vendor.menu && vendor.menu.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    おしながき
                  </h2>
                  <div className="rounded-xl bg-yellow-50 p-4">
                    <ul className="space-y-2">
                      {vendor.menu.map((item, index) => (
                        <li
                          className="flex justify-between"
                          key={`menu-${vendor.id}-${index}`}
                        >
                          <span className="text-gray-800">{item.item}</span>
                          {item.price && (
                            <span className="font-medium text-gray-600">
                              ¥{item.price.toLocaleString()}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {vendor.description && (
                <div className="mb-8">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">説明</h2>
                  <div className="prose max-w-none">
                    <RichText data={vendor.description} />
                  </div>
                </div>
              )}

              {vendor.location && (
                <div className="rounded-xl bg-gray-50 p-6">
                  <h2 className="mb-2 font-bold text-gray-800 text-xl">場所</h2>
                  <p className="text-gray-700">📍 {vendor.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center font-medium text-gray-600 text-lg">
            協賛企業
          </h2>
          <SponsorCarousel sponsors={sponsors} />
        </div>
      </section>
    </div>
  );
}
