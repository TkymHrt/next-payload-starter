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

  const boothsQuery = await payload.find({
    collection: "corporate-booths",
    limit: 100,
  });

  return boothsQuery.docs.map((item) => ({
    id: String(item.id),
  }));
}

export default async function CorporateDetailPage({ params }: Props) {
  const { id } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const booth = await payload.findByID({
    collection: "corporate-booths",
    id: Number(id),
    depth: 1,
  });

  if (!booth) {
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
    typeof booth.image === "object" && booth.image?.url
      ? booth.image.url
      : null;

  const locationLabels: Record<string, string> = {
    al1: "AL1",
    egg: "egg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-bold text-4xl">{booth.companyName}</h1>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {imageUrl && (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  alt={booth.companyName}
                  className="object-cover"
                  fill
                  src={imageUrl}
                />
              </div>
            )}
            <div className="p-8">
              {booth.description && (
                <div className="mb-8">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">説明</h2>
                  <div className="prose max-w-none">
                    <RichText data={booth.description} />
                  </div>
                </div>
              )}

              {booth.location && (
                <div className="rounded-xl bg-gray-50 p-6">
                  <h2 className="mb-2 font-bold text-gray-800 text-xl">場所</h2>
                  <p className="text-gray-700">
                    📍 {locationLabels[booth.location] || booth.location}
                  </p>
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
