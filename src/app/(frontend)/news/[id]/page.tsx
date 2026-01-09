import { RichText } from "@payloadcms/richtext-lexical/react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const newsQuery = await payload.find({
    collection: "news",
    limit: 100,
  });

  return newsQuery.docs.map((item) => ({
    id: String(item.id),
  }));
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const news = await payload.findByID({
    collection: "news",
    id: Number(id),
  });

  if (!news) {
    notFound();
  }

  const date = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <time className="text-blue-200 text-sm">{date}</time>
          <h1 className="mt-2 font-bold text-3xl md:text-4xl">{news.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <article className="rounded-xl bg-white p-8 shadow-lg">
            {news.content && (
              <div className="prose prose-lg max-w-none">
                <RichText data={news.content} />
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
