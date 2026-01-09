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

  const guestsQuery = await payload.find({
    collection: "guests",
    limit: 100,
  });

  return guestsQuery.docs.map((item) => ({
    id: String(item.id),
  }));
}

export default async function GuestDetailPage({ params }: Props) {
  const { id } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const guest = await payload.findByID({
    collection: "guests",
    id: Number(id),
    depth: 1,
  });

  if (!guest) {
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
    typeof guest.image === "object" && guest.image?.url
      ? guest.image.url
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-bold text-4xl">{guest.name}</h1>
        </div>
      </section>

      {/* Guest Info */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {imageUrl && (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  alt={guest.name}
                  className="object-cover"
                  fill
                  src={imageUrl}
                />
              </div>
            )}
            <div className="p-8">
              {/* Profile */}
              {guest.profile && (
                <div className="mb-8">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    プロフィール
                  </h2>
                  <div className="prose max-w-none">
                    <RichText data={guest.profile} />
                  </div>
                </div>
              )}

              {/* Event Info */}
              {guest.eventInfo && (
                <div className="mb-8 rounded-xl bg-blue-50 p-6">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    イベント情報
                  </h2>
                  <dl className="grid grid-cols-2 gap-4">
                    {guest.eventInfo.title && (
                      <>
                        <dt className="text-gray-600">イベント名</dt>
                        <dd className="font-medium">{guest.eventInfo.title}</dd>
                      </>
                    )}
                    {guest.eventInfo.date && (
                      <>
                        <dt className="text-gray-600">開催日</dt>
                        <dd className="font-medium">
                          {new Date(guest.eventInfo.date).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </dd>
                      </>
                    )}
                    {guest.eventInfo.time && (
                      <>
                        <dt className="text-gray-600">時間</dt>
                        <dd className="font-medium">{guest.eventInfo.time}</dd>
                      </>
                    )}
                    {guest.eventInfo.location && (
                      <>
                        <dt className="text-gray-600">場所</dt>
                        <dd className="font-medium">
                          {guest.eventInfo.location}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              )}

              {/* Ticket Info */}
              {guest.ticketInfo && (
                <div className="mb-8 rounded-xl bg-yellow-50 p-6">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    整理券情報
                  </h2>
                  <p className="whitespace-pre-line text-gray-700">
                    {guest.ticketInfo}
                  </p>
                </div>
              )}

              {/* Notes */}
              {guest.notes && (
                <div className="rounded-xl bg-red-50 p-6">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    注意事項
                  </h2>
                  <p className="whitespace-pre-line text-gray-700">
                    {guest.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Carousel */}
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
