import Link from "next/link";
import { getPayload } from "payload";
import { MainCarousel } from "@/components/MainCarousel";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import { Button } from "@/components/ui/Button";
import config from "@/payload.config";

export const revalidate = 60;

export default async function HomePage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  // Fetch news
  const newsQuery = await payload.find({
    collection: "news",
    limit: 5,
    sort: "-publishedAt",
  });

  // Fetch sponsors
  const sponsorsQuery = await payload.find({
    collection: "sponsors",
    limit: 50,
    sort: "order",
  });

  // Fetch guests for carousel
  const guestsQuery = await payload.find({
    collection: "guests",
    limit: 10,
    depth: 1,
  });

  const sponsors = sponsorsQuery.docs.map((s) => ({
    id: s.id,
    name: s.name,
    logo: typeof s.logo === "object" ? s.logo : null,
    url: s.url,
  }));

  const carouselItems = guestsQuery.docs.map((g) => ({
    id: g.id,
    image: typeof g.image === "object" ? g.image : null,
    title: g.name,
    link: `/guests/${g.id}`,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-5xl md:text-7xl">第45回技大祭</h1>
          <p className="mb-8 text-blue-100 text-xl md:text-2xl">
            開催日は管理画面から設定してください
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/access">
              <Button variant="secondary">アクセス</Button>
            </Link>
            <Link href="/map">
              <Button variant="secondary">マップ</Button>
            </Link>
            <Link href="/events">
              <Button variant="primary">企画一覧</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Carousel */}
      {carouselItems.length > 0 && (
        <section className="bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <MainCarousel items={carouselItems} />
          </div>
        </section>
      )}

      {/* Sponsor Carousel */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <SponsorCarousel sponsors={sponsors} />
        </div>
      </section>

      {/* News Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            お知らせ
          </h2>
          {newsQuery.docs.length > 0 ? (
            <div className="space-y-4">
              {newsQuery.docs.map((item) => {
                const date = item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString("ja-JP", {
                      month: "long",
                      day: "numeric",
                    })
                  : "";

                return (
                  <Link
                    className="block rounded-lg bg-white p-4 transition-shadow hover:shadow-md"
                    href={`/news/${item.id}`}
                    key={item.id}
                  >
                    <div className="flex items-center gap-4">
                      <time className="w-16 shrink-0 text-gray-500 text-sm">
                        {date}
                      </time>
                      <span className="text-gray-800">{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              お知らせはまだありません
            </p>
          )}
          <div className="mt-6 text-center">
            <Link href="/news">
              <Button variant="quiet">お知らせ一覧</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center font-bold text-2xl text-gray-800">
            コンテンツ
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "企画",
                description: "ステージイベント・参加型企画",
                href: "/events",
                emoji: "🎪",
              },
              {
                title: "展示・体験",
                description: "研究室展示・体験コンテンツ",
                href: "/exhibitions",
                emoji: "🔬",
              },
              {
                title: "食品販売",
                description: "フード・スイーツ・ドリンク",
                href: "/food",
                emoji: "🍔",
              },
              {
                title: "物品販売",
                description: "フリマ・グッズ販売",
                href: "/goods",
                emoji: "🛍️",
              },
              {
                title: "企業ブース",
                description: "企業展示・説明会",
                href: "/corporate",
                emoji: "🏢",
              },
              {
                title: "協賛企業",
                description: "スポンサー一覧",
                href: "/sponsors",
                emoji: "🤝",
              },
            ].map((item) => (
              <Link
                className="group rounded-xl bg-gray-50 p-6 transition-colors hover:bg-blue-50"
                href={item.href}
                key={item.href}
              >
                <div className="mb-3 text-4xl">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="mt-1 text-gray-500 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-2xl text-gray-800">
            ご注意事項
          </h2>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: "🚭", text: "構内禁煙" },
                { icon: "🚫", text: "飲酒禁止（一部エリアを除く）" },
                { icon: "🐕", text: "ペット同伴禁止" },
                { icon: "📸", text: "一部撮影禁止エリアあり" },
              ].map((item) => (
                <li className="flex items-center gap-3" key={item.text}>
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sponsor Carousel (Bottom) */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center font-medium text-gray-600 text-lg">
            協賛企業
          </h2>
          <SponsorCarousel sponsors={sponsors} />
        </div>
      </section>

      {/* Sponsor Recruitment */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-2xl">協賛のお願い</h2>
          <p className="mb-6 text-blue-100">
            第45回技大祭では、協賛企業を募集しております。
            <br />
            ご興味のある企業様はお問い合わせください。
          </p>
          <Link href="/sponsors">
            <Button variant="secondary">協賛企業一覧</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
