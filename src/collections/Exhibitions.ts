import type { CollectionConfig } from "payload";

export const Exhibitions: CollectionConfig = {
  slug: "exhibitions",
  labels: { singular: "展示・体験", plural: "展示・体験" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "location", "createdAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "展示名",
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
        { label: "子供向け", value: "kids" },
        { label: "展示", value: "display" },
        { label: "体験", value: "experience" },
        { label: "研究室", value: "lab" },
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
