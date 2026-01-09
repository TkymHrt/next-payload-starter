import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";

export const revalidate = 60;

export default async function NewsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const newsQuery = await payload.find({
    collection: "news",
    limit: 50,
    sort: "-publishedAt",
  });

  const news = newsQuery.docs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">お知らせ</h1>
          <p className="text-blue-100 text-xl">最新情報・お知らせ一覧</p>
        </div>
      </section>

      {/* News List */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {news.length > 0 ? (
            <div className="space-y-4">
              {news.map((item) => {
                const date = item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "";

                return (
                  <Link
                    className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    href={`/news/${item.id}`}
                    key={item.id}
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                      <time className="shrink-0 text-gray-500 text-sm">
                        {date}
                      </time>
                      <h2 className="font-medium text-gray-800 text-lg">
                        {item.title}
                      </h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              お知らせはまだありません
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
