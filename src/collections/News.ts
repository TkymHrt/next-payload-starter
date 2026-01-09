import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "お知らせ", plural: "お知らせ" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "createdAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "タイトル",
    },
    {
      name: "content",
      type: "richText",
      label: "内容",
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "公開日",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
  ],
  timestamps: true,
};
