import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

export default async function CorporatePage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const boothsQuery = await payload.find({
    collection: "corporate-booths",
    limit: 100,
    depth: 1,
  });

  const booths = boothsQuery.docs;

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

  const locationLabels: Record<string, string> = {
    al1: "AL1",
    egg: "egg",
  };

  // Group by location
  const boothsByLocation = {
    al1: booths.filter((b) => b.location === "al1"),
    egg: booths.filter((b) => b.location === "egg"),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">企業ブース一覧</h1>
          <p className="text-blue-100 text-xl">企業展示・説明会</p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {["al1", "egg"].map((loc) => {
            const locationBooths =
              boothsByLocation[loc as keyof typeof boothsByLocation];
            if (locationBooths.length === 0) return null;

            return (
              <div className="mb-12" key={loc}>
                <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
                  📍 {locationLabels[loc]}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {locationBooths.map((booth) => {
                    const imageUrl =
                      typeof booth.image === "object" && booth.image?.url
                        ? booth.image.url
                        : null;

                    return (
                      <Link
                        className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                        href={`/corporate/${booth.id}`}
                        key={booth.id}
                      >
                        {imageUrl && (
                          <div className="relative aspect-video bg-gray-100">
                            <Image
                              alt={booth.companyName}
                              className="object-cover transition-transform group-hover:scale-105"
                              fill
                              src={imageUrl}
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                            {booth.companyName}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {booths.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              企業ブースはまだ登録されていません
            </div>
          )}
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
