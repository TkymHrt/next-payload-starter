import { getPayload } from "payload";
import { ListPageClient } from "@/components/ListPageClient";
import config from "@/payload.config";

export const revalidate = 60;

const tagOptions = [
  { label: "子供向け", value: "kids" },
  { label: "展示", value: "display" },
  { label: "体験", value: "experience" },
  { label: "研究室", value: "lab" },
  { label: "企業", value: "corporate" },
  { label: "学生", value: "student" },
];

export default async function ExhibitionsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const exhibitionsQuery = await payload.find({
    collection: "exhibitions",
    limit: 100,
    depth: 1,
  });

  const exhibitions = exhibitionsQuery.docs.map((e) => ({
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
      basePath="/exhibitions"
      description="研究室展示・体験型コンテンツ"
      events={exhibitions}
      sponsors={sponsors}
      tagOptions={tagOptions}
      title="展示・体験一覧"
    />
  );
}
