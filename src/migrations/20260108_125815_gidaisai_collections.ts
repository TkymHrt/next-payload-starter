import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sponsors_tier" AS ENUM('platinum', 'gold', 'silver', 'general');
  CREATE TYPE "public"."enum_events_tags" AS ENUM('kids', 'stage', 'indoor', 'outdoor', 'day1', 'day2');
  CREATE TYPE "public"."enum_exhibitions_tags" AS ENUM('kids', 'display', 'experience', 'lab', 'corporate', 'student');
  CREATE TYPE "public"."enum_food_vendors_tags" AS ENUM('food', 'sweets', 'alcohol', 'food-truck');
  CREATE TYPE "public"."enum_goods_vendors_tags" AS ENUM('flea-market', 'goods', 'corporate', 'student');
  CREATE TYPE "public"."enum_corporate_booths_location" AS ENUM('al1', 'egg');
  CREATE TYPE "public"."enum_site_config_social_links_platform" AS ENUM('twitter', 'instagram', 'facebook');
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "guests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"profile" jsonb,
  	"event_info_title" varchar,
  	"event_info_date" timestamp(3) with time zone,
  	"event_info_time" varchar,
  	"event_info_location" varchar,
  	"ticket_info" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"tier" "enum_sponsors_tier" DEFAULT 'general',
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_events_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"description" jsonb,
  	"schedule_sunny_start" varchar,
  	"schedule_sunny_end" varchar,
  	"schedule_rainy_start" varchar,
  	"schedule_rainy_end" varchar,
  	"location" varchar,
  	"application_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exhibitions_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_exhibitions_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "exhibitions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"description" jsonb,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "food_vendors_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"price" numeric
  );
  
  CREATE TABLE "food_vendors_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_food_vendors_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "food_vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"description" jsonb,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "goods_vendors_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_goods_vendors_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "goods_vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"description" jsonb,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "corporate_booths" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"image_id" integer,
  	"description" jsonb,
  	"location" "enum_corporate_booths_location",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_config_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_config_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "site_config_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT '第45回技大祭' NOT NULL,
  	"logo_id" integer,
  	"hero_image_id" integer,
  	"event_dates_day1" timestamp(3) with time zone,
  	"event_dates_day2" timestamp(3) with time zone,
  	"address" varchar,
  	"copyright" varchar DEFAULT '© 2026 技大祭実行委員会',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sponsors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "exhibitions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "food_vendors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "goods_vendors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "corporate_booths_id" integer;
  ALTER TABLE "guests" ADD CONSTRAINT "guests_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exhibitions_tags" ADD CONSTRAINT "exhibitions_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exhibitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exhibitions" ADD CONSTRAINT "exhibitions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "food_vendors_menu" ADD CONSTRAINT "food_vendors_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_vendors_tags" ADD CONSTRAINT "food_vendors_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_vendors" ADD CONSTRAINT "food_vendors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "goods_vendors_tags" ADD CONSTRAINT "goods_vendors_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."goods_vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "goods_vendors" ADD CONSTRAINT "goods_vendors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corporate_booths" ADD CONSTRAINT "corporate_booths_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config_social_links" ADD CONSTRAINT "site_config_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_links" ADD CONSTRAINT "site_config_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "guests_image_idx" ON "guests" USING btree ("image_id");
  CREATE INDEX "guests_updated_at_idx" ON "guests" USING btree ("updated_at");
  CREATE INDEX "guests_created_at_idx" ON "guests" USING btree ("created_at");
  CREATE INDEX "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE INDEX "events_tags_order_idx" ON "events_tags" USING btree ("order");
  CREATE INDEX "events_tags_parent_idx" ON "events_tags" USING btree ("parent_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "exhibitions_tags_order_idx" ON "exhibitions_tags" USING btree ("order");
  CREATE INDEX "exhibitions_tags_parent_idx" ON "exhibitions_tags" USING btree ("parent_id");
  CREATE INDEX "exhibitions_image_idx" ON "exhibitions" USING btree ("image_id");
  CREATE INDEX "exhibitions_updated_at_idx" ON "exhibitions" USING btree ("updated_at");
  CREATE INDEX "exhibitions_created_at_idx" ON "exhibitions" USING btree ("created_at");
  CREATE INDEX "food_vendors_menu_order_idx" ON "food_vendors_menu" USING btree ("_order");
  CREATE INDEX "food_vendors_menu_parent_id_idx" ON "food_vendors_menu" USING btree ("_parent_id");
  CREATE INDEX "food_vendors_tags_order_idx" ON "food_vendors_tags" USING btree ("order");
  CREATE INDEX "food_vendors_tags_parent_idx" ON "food_vendors_tags" USING btree ("parent_id");
  CREATE INDEX "food_vendors_image_idx" ON "food_vendors" USING btree ("image_id");
  CREATE INDEX "food_vendors_updated_at_idx" ON "food_vendors" USING btree ("updated_at");
  CREATE INDEX "food_vendors_created_at_idx" ON "food_vendors" USING btree ("created_at");
  CREATE INDEX "goods_vendors_tags_order_idx" ON "goods_vendors_tags" USING btree ("order");
  CREATE INDEX "goods_vendors_tags_parent_idx" ON "goods_vendors_tags" USING btree ("parent_id");
  CREATE INDEX "goods_vendors_image_idx" ON "goods_vendors" USING btree ("image_id");
  CREATE INDEX "goods_vendors_updated_at_idx" ON "goods_vendors" USING btree ("updated_at");
  CREATE INDEX "goods_vendors_created_at_idx" ON "goods_vendors" USING btree ("created_at");
  CREATE INDEX "corporate_booths_image_idx" ON "corporate_booths" USING btree ("image_id");
  CREATE INDEX "corporate_booths_updated_at_idx" ON "corporate_booths" USING btree ("updated_at");
  CREATE INDEX "corporate_booths_created_at_idx" ON "corporate_booths" USING btree ("created_at");
  CREATE INDEX "site_config_social_links_order_idx" ON "site_config_social_links" USING btree ("_order");
  CREATE INDEX "site_config_social_links_parent_id_idx" ON "site_config_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_config_footer_links_order_idx" ON "site_config_footer_links" USING btree ("_order");
  CREATE INDEX "site_config_footer_links_parent_id_idx" ON "site_config_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_config_logo_idx" ON "site_config" USING btree ("logo_id");
  CREATE INDEX "site_config_hero_image_idx" ON "site_config" USING btree ("hero_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guests_fk" FOREIGN KEY ("guests_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exhibitions_fk" FOREIGN KEY ("exhibitions_id") REFERENCES "public"."exhibitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_food_vendors_fk" FOREIGN KEY ("food_vendors_id") REFERENCES "public"."food_vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_goods_vendors_fk" FOREIGN KEY ("goods_vendors_id") REFERENCES "public"."goods_vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corporate_booths_fk" FOREIGN KEY ("corporate_booths_id") REFERENCES "public"."corporate_booths"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_guests_id_idx" ON "payload_locked_documents_rels" USING btree ("guests_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_exhibitions_id_idx" ON "payload_locked_documents_rels" USING btree ("exhibitions_id");
  CREATE INDEX "payload_locked_documents_rels_food_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("food_vendors_id");
  CREATE INDEX "payload_locked_documents_rels_goods_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("goods_vendors_id");
  CREATE INDEX "payload_locked_documents_rels_corporate_booths_id_idx" ON "payload_locked_documents_rels" USING btree ("corporate_booths_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "exhibitions_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "exhibitions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "food_vendors_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "food_vendors_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "food_vendors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "goods_vendors_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "goods_vendors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "corporate_booths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_config_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_config_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_config" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "news" CASCADE;
  DROP TABLE "guests" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "events_tags" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "exhibitions_tags" CASCADE;
  DROP TABLE "exhibitions" CASCADE;
  DROP TABLE "food_vendors_menu" CASCADE;
  DROP TABLE "food_vendors_tags" CASCADE;
  DROP TABLE "food_vendors" CASCADE;
  DROP TABLE "goods_vendors_tags" CASCADE;
  DROP TABLE "goods_vendors" CASCADE;
  DROP TABLE "corporate_booths" CASCADE;
  DROP TABLE "site_config_social_links" CASCADE;
  DROP TABLE "site_config_footer_links" CASCADE;
  DROP TABLE "site_config" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sponsors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_exhibitions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_food_vendors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_goods_vendors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_corporate_booths_fk";
  
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  DROP INDEX "payload_locked_documents_rels_guests_id_idx";
  DROP INDEX "payload_locked_documents_rels_sponsors_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_exhibitions_id_idx";
  DROP INDEX "payload_locked_documents_rels_food_vendors_id_idx";
  DROP INDEX "payload_locked_documents_rels_goods_vendors_id_idx";
  DROP INDEX "payload_locked_documents_rels_corporate_booths_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "guests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sponsors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "exhibitions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "food_vendors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "goods_vendors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "corporate_booths_id";
  DROP TYPE "public"."enum_sponsors_tier";
  DROP TYPE "public"."enum_events_tags";
  DROP TYPE "public"."enum_exhibitions_tags";
  DROP TYPE "public"."enum_food_vendors_tags";
  DROP TYPE "public"."enum_goods_vendors_tags";
  DROP TYPE "public"."enum_corporate_booths_location";
  DROP TYPE "public"."enum_site_config_social_links_platform";`)
}
