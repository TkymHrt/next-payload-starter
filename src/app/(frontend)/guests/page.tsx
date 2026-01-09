import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

export default async function GuestsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const guestsQuery = await payload.find({
    collection: "guests",
    limit: 50,
    depth: 1,
  });

  const guests = guestsQuery.docs;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">ゲスト一覧</h1>
          <p className="text-blue-100 text-xl">
            お笑いライブ・トークショーなど
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {guests.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guests.map((guest) => {
                const imageUrl =
                  typeof guest.image === "object" && guest.image?.url
                    ? guest.image.url
                    : null;

                return (
                  <Link
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                    href={`/guests/${guest.id}`}
                    key={guest.id}
                  >
                    {imageUrl && (
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          alt={guest.name}
                          className="object-cover transition-transform group-hover:scale-105"
                          fill
                          src={imageUrl}
                        />
                      </div>
                    )}
                    <div className="p-4 text-center">
                      <h2 className="font-bold text-gray-800 text-lg transition-colors group-hover:text-blue-600">
                        {guest.name}
                      </h2>
                      {guest.eventInfo?.title && (
                        <p className="mt-1 text-gray-500 text-sm">
                          {guest.eventInfo.title}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              ゲスト情報はまだ登録されていません
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
