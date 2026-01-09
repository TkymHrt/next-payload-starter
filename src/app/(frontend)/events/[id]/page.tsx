import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import { Button } from "@/components/ui/Button";
import config from "@/payload.config";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const eventsQuery = await payload.find({
    collection: "events",
    limit: 100,
  });

  return eventsQuery.docs.map((item) => ({
    id: String(item.id),
  }));
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const event = await payload.findByID({
    collection: "events",
    id: Number(id),
    depth: 1,
  });

  if (!event) {
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
    typeof event.image === "object" && event.image?.url
      ? event.image.url
      : null;

  const tagLabels: Record<string, string> = {
    kids: "子供向け",
    stage: "ステージ",
    indoor: "屋内",
    outdoor: "屋外",
    day1: "1日目",
    day2: "2日目",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-bold text-4xl">{event.title}</h1>
          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {event.tags.map((tag) => (
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

      {/* Content */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {imageUrl && (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  alt={event.title}
                  className="object-cover"
                  fill
                  src={imageUrl}
                />
              </div>
            )}
            <div className="p-8">
              {/* Application Button */}
              {event.applicationUrl && (
                <div className="mb-8">
                  <Link href={event.applicationUrl}>
                    <Button variant="primary">参加応募はこちら</Button>
                  </Link>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div className="mb-8">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">説明</h2>
                  <div className="prose max-w-none">
                    <RichText data={event.description} />
                  </div>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && (
                <div className="mb-8 rounded-xl bg-blue-50 p-6">
                  <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    スケジュール
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium text-gray-700">
                        ☀️ 晴天時
                      </h3>
                      <p className="text-gray-600">
                        {event.schedule.sunnyStart} 〜 {event.schedule.sunnyEnd}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium text-gray-700">
                        🌧️ 雨天時
                      </h3>
                      <p className="text-gray-600">
                        {event.schedule.rainyStart} 〜 {event.schedule.rainyEnd}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              {event.location && (
                <div className="rounded-xl bg-gray-50 p-6">
                  <h2 className="mb-2 font-bold text-gray-800 text-xl">場所</h2>
                  <p className="text-gray-700">📍 {event.location}</p>
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
