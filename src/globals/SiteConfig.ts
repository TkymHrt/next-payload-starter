import type { GlobalConfig } from "payload";

export const SiteConfig: GlobalConfig = {
  slug: "site-config",
  label: "サイト設定",
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "第45回技大祭",
      label: "サイト名",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "ロゴ",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "ヒーロー画像",
    },
    {
      name: "eventDates",
      type: "group",
      label: "開催日程",
      fields: [
        { name: "day1", type: "date", label: "1日目" },
        { name: "day2", type: "date", label: "2日目" },
      ],
    },
    {
      name: "address",
      type: "textarea",
      label: "住所",
    },
    {
      name: "socialLinks",
      type: "array",
      label: "SNSリンク",
      fields: [
        {
          name: "platform",
          type: "select",
          options: [
            { label: "X (Twitter)", value: "twitter" },
            { label: "Instagram", value: "instagram" },
            { label: "Facebook", value: "facebook" },
          ],
        },
        { name: "url", type: "text", label: "URL" },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      label: "フッターリンク",
      fields: [
        { name: "label", type: "text", label: "ラベル" },
        { name: "url", type: "text", label: "URL" },
      ],
    },
    {
      name: "copyright",
      type: "text",
      label: "著作権表記",
      defaultValue: "© 2026 技大祭実行委員会",
    },
  ],
};
