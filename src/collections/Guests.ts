import type { CollectionConfig } from "payload";

export const Guests: CollectionConfig = {
  slug: "guests",
  labels: { singular: "ゲスト", plural: "ゲスト" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "eventInfo.date", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "名前",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "画像",
    },
    {
      name: "profile",
      type: "richText",
      label: "プロフィール",
    },
    {
      name: "eventInfo",
      type: "group",
      label: "イベント情報",
      fields: [
        { name: "title", type: "text", label: "イベント名" },
        { name: "date", type: "date", label: "開催日" },
        { name: "time", type: "text", label: "時間" },
        { name: "location", type: "text", label: "場所" },
      ],
    },
    {
      name: "ticketInfo",
      type: "textarea",
      label: "整理券情報",
      admin: {
        description: "配布場所・時間・ルールなど",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "注意事項",
      admin: {
        description: "撮影・録音・持ち込みなどの注意事項",
      },
    },
  ],
  timestamps: true,
};
