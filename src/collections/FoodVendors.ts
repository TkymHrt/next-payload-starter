import type { CollectionConfig } from "payload";

export const FoodVendors: CollectionConfig = {
  slug: "food-vendors",
  labels: { singular: "食品販売", plural: "食品販売" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "location", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "店舗名",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "画像",
    },
    {
      name: "description",
      type: "richText",
      label: "説明",
    },
    {
      name: "menu",
      type: "array",
      label: "おしながき",
      fields: [
        { name: "item", type: "text", label: "商品名", required: true },
        { name: "price", type: "number", label: "価格" },
      ],
    },
    {
      name: "tags",
      type: "select",
      hasMany: true,
      label: "タグ",
      options: [
        { label: "フード", value: "food" },
        { label: "スイーツ", value: "sweets" },
        { label: "酒", value: "alcohol" },
        { label: "キッチンカー", value: "food-truck" },
      ],
    },
    {
      name: "location",
      type: "text",
      label: "場所",
    },
  ],
  timestamps: true,
};
