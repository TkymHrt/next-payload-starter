import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

export default async function GreetingPage() {
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
          <h1 className="mb-4 font-bold text-4xl">ご挨拶</h1>
          <p className="text-blue-100 text-xl">第45回技大祭にようこそ</p>
        </div>
      </section>

      {/* Theme Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            テーマ紹介
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <p className="text-center text-gray-600 text-lg leading-relaxed">
              第45回技大祭のテーマは、管理画面から設定できます。
            </p>
          </div>
        </div>
      </section>

      {/* President Message */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            学長挨拶
          </h2>
          <div className="rounded-xl bg-gray-50 p-8">
            <p className="text-gray-600 leading-relaxed">
              学長からのメッセージは管理画面から設定できます。
            </p>
          </div>
        </div>
      </section>

      {/* Committee Chair Message */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            実行委員長挨拶
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <p className="text-gray-600 leading-relaxed">
              実行委員長からのメッセージは管理画面から設定できます。
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
