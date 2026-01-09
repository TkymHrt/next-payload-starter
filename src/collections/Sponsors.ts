import type { CollectionConfig } from "payload";

export const Sponsors: CollectionConfig = {
  slug: "sponsors",
  labels: { singular: "協賛企業", plural: "協賛企業" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "tier", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "企業名",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "ロゴ",
    },
    {
      name: "url",
      type: "text",
      label: "企業サイトURL",
    },
    {
      name: "tier",
      type: "select",
      label: "協賛ランク",
      options: [
        { label: "プラチナ", value: "platinum" },
        { label: "ゴールド", value: "gold" },
        { label: "シルバー", value: "silver" },
        { label: "一般", value: "general" },
      ],
      defaultValue: "general",
    },
    {
      name: "order",
      type: "number",
      label: "表示順",
      admin: {
        description: "小さい数値ほど先に表示",
      },
    },
  ],
  timestamps: true,
};
