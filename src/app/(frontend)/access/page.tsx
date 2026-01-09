import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

export default async function AccessPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">アクセス</h1>
          <p className="text-blue-100 text-xl">会場へのアクセス情報</p>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            会場案内
          </h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {/* Google Maps Embed Placeholder */}
            <div className="flex aspect-video items-center justify-center bg-gray-200">
              <p className="text-gray-500">
                Googleマップ埋め込み（管理画面から設定）
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            開催情報
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-2 font-bold text-gray-800">開催日時</h3>
              <p className="text-gray-600">管理画面から設定してください</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-2 font-bold text-gray-800">開催場所</h3>
              <p className="text-gray-600">長岡技術科学大学</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Schedule */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            バス時刻表
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <p className="text-center text-gray-600">
              バス時刻表は管理画面から画像をアップロードしてください
            </p>
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
