import { getPayload } from "payload";
import { ListPageClient } from "@/components/ListPageClient";
import config from "@/payload.config";

export const revalidate = 60;

const tagOptions = [
  { label: "フリマ", value: "flea-market" },
  { label: "グッズ", value: "goods" },
  { label: "企業", value: "corporate" },
  { label: "学生", value: "student" },
];

export default async function GoodsPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const goodsQuery = await payload.find({
    collection: "goods-vendors",
    limit: 100,
    depth: 1,
  });

  const goodsVendors = goodsQuery.docs.map((g) => ({
    id: g.id,
    title: g.name,
    image: typeof g.image === "object" ? g.image : null,
    tags: g.tags,
    location: g.location,
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
      basePath="/goods"
      description="フリマ・グッズ販売"
      events={goodsVendors}
      sponsors={sponsors}
      tagOptions={tagOptions}
      title="物品販売一覧"
    />
  );
}
