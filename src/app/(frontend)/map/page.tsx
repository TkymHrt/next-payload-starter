import { getPayload } from "payload";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import config from "@/payload.config";

export const revalidate = 60;

export default async function MapPage() {
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
          <h1 className="mb-4 font-bold text-4xl">マップ</h1>
          <p className="text-blue-100 text-xl">会場マップ・フロアマップ</p>
        </div>
      </section>

      {/* Overall Map */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            全体マップ
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-200">
              <p className="text-gray-500">
                全体マップ画像（通常/謎解き/スタンプラリー）
              </p>
            </div>
            <p className="mt-4 text-center text-gray-500 text-sm">
              カルーセルで複数のマップを切り替え可能です
            </p>
          </div>
        </div>
      </section>

      {/* Floor Maps */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            講義棟フロアマップ
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["1F", "2F", "3F"].map((floor) => (
              <div className="rounded-xl bg-gray-50 p-4" key={floor}>
                <h3 className="mb-3 text-center font-bold text-gray-800">
                  {floor}
                </h3>
                <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-200">
                  <p className="text-gray-500 text-sm">{floor}マップ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outdoor Map */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            屋外エリアマップ
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
              <p className="text-gray-500">屋外エリア詳細マップ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parking Notice */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-2 font-bold text-yellow-800">駐車場について</h3>
            <p className="text-yellow-700">
              駐車場の注意事項は管理画面から設定してください。
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
