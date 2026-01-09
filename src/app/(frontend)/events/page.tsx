import { getPayload } from "payload";
import { ListPageClient } from "@/components/ListPageClient";
import config from "@/payload.config";

export const revalidate = 60;

const tagOptions = [
  { label: "子供向け", value: "kids" },
  { label: "ステージ", value: "stage" },
  { label: "屋内", value: "indoor" },
  { label: "屋外", value: "outdoor" },
  { label: "1日目", value: "day1" },
  { label: "2日目", value: "day2" },
];

export default async function EventsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const eventsQuery = await payload.find({
    collection: "events",
    limit: 100,
    depth: 1,
  });

  const events = eventsQuery.docs.map((e) => ({
    id: e.id,
    title: e.title,
    image: typeof e.image === "object" ? e.image : null,
    tags: e.tags,
    location: e.location,
  }));

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
    <ListPageClient
      basePath="/events"
      description="ステージイベント・参加型企画"
      events={events}
      sponsors={sponsors}
      tagOptions={tagOptions}
      title="企画一覧"
    />
  );
}
