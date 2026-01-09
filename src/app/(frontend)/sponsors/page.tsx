import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";

export const revalidate = 60;

export default async function SponsorsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const sponsorsQuery = await payload.find({
    collection: "sponsors",
    limit: 100,
    sort: "order",
    depth: 1,
  });

  const sponsors = sponsorsQuery.docs;

  // Group sponsors by tier
  const sponsorsByTier = {
    platinum: sponsors.filter((s) => s.tier === "platinum"),
    gold: sponsors.filter((s) => s.tier === "gold"),
    silver: sponsors.filter((s) => s.tier === "silver"),
    general: sponsors.filter((s) => s.tier === "general"),
  };

  const tierConfig = [
    { key: "platinum" as const, label: "プラチナスポンサー", size: "large" },
    { key: "gold" as const, label: "ゴールドスポンサー", size: "medium" },
    { key: "silver" as const, label: "シルバースポンサー", size: "small" },
    { key: "general" as const, label: "一般スポンサー", size: "small" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">協賛企業一覧</h1>
          <p className="text-blue-100 text-xl">
            第45回技大祭をご支援いただいている企業様
          </p>
        </div>
      </section>

      {/* Sponsors List */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {tierConfig.map(({ key, label, size }) => {
            const tierSponsors = sponsorsByTier[key];
            if (tierSponsors.length === 0) return null;

            const gridClass =
              size === "large"
                ? "grid-cols-2 md:grid-cols-3"
                : size === "medium"
                  ? "grid-cols-3 md:grid-cols-4"
                  : "grid-cols-4 md:grid-cols-6";

            const logoClass =
              size === "large" ? "h-24" : size === "medium" ? "h-16" : "h-12";

            return (
              <div className="mb-12" key={key}>
                <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
                  {label}
                </h2>
                <div className={`grid ${gridClass} gap-4`}>
                  {tierSponsors.map((sponsor) => {
                    const logoUrl =
                      typeof sponsor.logo === "object" && sponsor.logo?.url
                        ? sponsor.logo.url
                        : null;

                    const content = (
                      <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                        {logoUrl ? (
                          <Image
                            alt={sponsor.name}
                            className={`${logoClass} w-auto object-contain`}
                            height={100}
                            src={logoUrl}
                            width={200}
                          />
                        ) : (
                          <span className="text-center text-gray-600 text-sm">
                            {sponsor.name}
                          </span>
                        )}
                      </div>
                    );

                    if (sponsor.url) {
                      return (
                        <Link
                          href={sponsor.url}
                          key={sponsor.id}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {content}
                        </Link>
                      );
                    }

                    return <div key={sponsor.id}>{content}</div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Text-only sponsors (those without logos) */}
      {sponsors.filter((s) => typeof s.logo !== "object" || !s.logo?.url)
        .length > 0 && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
              その他の協賛企業
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {sponsors
                .filter((s) => typeof s.logo !== "object" || !s.logo?.url)
                .map((sponsor) =>
                  sponsor.url ? (
                    <Link
                      className="text-blue-600 hover:underline"
                      href={sponsor.url}
                      key={sponsor.id}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {sponsor.name}
                    </Link>
                  ) : (
                    <span className="text-gray-600" key={sponsor.id}>
                      {sponsor.name}
                    </span>
                  )
                )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
