import type { CollectionConfig } from "payload";

export const CorporateBooths: CollectionConfig = {
  slug: "corporate-booths",
  labels: { singular: "企業ブース", plural: "企業ブース" },
  admin: {
    useAsTitle: "companyName",
    defaultColumns: ["companyName", "location", "createdAt"],
  },
  fields: [
    {
      name: "companyName",
      type: "text",
      required: true,
      label: "企業名",
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
      name: "location",
      type: "select",
      label: "開催場所",
      options: [
        { label: "AL1", value: "al1" },
        { label: "egg", value: "egg" },
      ],
    },
  ],
  timestamps: true,
};
