import { getPayload } from "payload";
import { ListPageClient } from "@/components/ListPageClient";
import config from "@/payload.config";

export const revalidate = 60;

const tagOptions = [
  { label: "フード", value: "food" },
  { label: "スイーツ", value: "sweets" },
  { label: "酒", value: "alcohol" },
  { label: "キッチンカー", value: "food-truck" },
];

export default async function FoodPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const foodQuery = await payload.find({
    collection: "food-vendors",
    limit: 100,
    depth: 1,
  });

  const foodVendors = foodQuery.docs.map((f) => ({
    id: f.id,
    title: f.name,
    image: typeof f.image === "object" ? f.image : null,
    tags: f.tags,
    location: f.location,
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
      basePath="/food"
      description="フード・スイーツ・ドリンク"
      events={foodVendors}
      sponsors={sponsors}
      tagOptions={tagOptions}
      title="食品販売一覧"
    />
  );
}
