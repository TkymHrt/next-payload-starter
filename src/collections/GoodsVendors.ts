import type { CollectionConfig } from "payload";

export const GoodsVendors: CollectionConfig = {
  slug: "goods-vendors",
  labels: { singular: "物品販売", plural: "物品販売" },
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
      name: "tags",
      type: "select",
      hasMany: true,
      label: "タグ",
      options: [
        { label: "フリマ", value: "flea-market" },
        { label: "グッズ", value: "goods" },
        { label: "企業", value: "corporate" },
        { label: "学生", value: "student" },
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
