import type { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "企画", plural: "企画" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "location", "createdAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "企画名",
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
        { label: "ステージ", value: "stage" },
        { label: "屋内", value: "indoor" },
        { label: "屋外", value: "outdoor" },
        { label: "1日目", value: "day1" },
        { label: "2日目", value: "day2" },
      ],
    },
    {
      name: "schedule",
      type: "group",
      label: "スケジュール",
      fields: [
        { name: "sunnyStart", type: "text", label: "晴天時開始" },
        { name: "sunnyEnd", type: "text", label: "晴天時終了" },
        { name: "rainyStart", type: "text", label: "雨天時開始" },
        { name: "rainyEnd", type: "text", label: "雨天時終了" },
      ],
    },
    {
      name: "location",
      type: "text",
      label: "場所",
    },
    {
      name: "applicationUrl",
      type: "text",
      label: "参加応募URL",
    },
  ],
  timestamps: true,
};
