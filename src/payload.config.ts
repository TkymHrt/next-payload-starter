import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";
import { CorporateBooths } from "./collections/CorporateBooths";
import { Events } from "./collections/Events";
import { Exhibitions } from "./collections/Exhibitions";
import { FoodVendors } from "./collections/FoodVendors";
import { GoodsVendors } from "./collections/GoodsVendors";
import { Guests } from "./collections/Guests";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { Sponsors } from "./collections/Sponsors";
import { Users } from "./collections/Users";
import { SiteConfig } from "./globals/SiteConfig";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    News,
    Guests,
    Sponsors,
    Events,
    Exhibitions,
    FoodVendors,
    GoodsVendors,
    CorporateBooths,
  ],
  globals: [SiteConfig],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION || "",
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
});
