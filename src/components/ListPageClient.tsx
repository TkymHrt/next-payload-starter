"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SponsorCarousel } from "@/components/SponsorCarousel";
import { TagFilter } from "@/components/TagFilter";

interface EventItem {
  id: number;
  title: string;
  image?: { url?: string | null; alt?: string } | null;
  tags?: string[] | null;
  location?: string | null;
}

interface Sponsor {
  id: number;
  name: string;
  logo?: { url?: string | null } | null;
  url?: string | null;
}

interface EventsListClientProps {
  events: EventItem[];
  sponsors: Sponsor[];
  tagOptions: { label: string; value: string }[];
  basePath: string;
  title: string;
  description: string;
}

export function ListPageClient({
  events,
  sponsors,
  tagOptions,
  basePath,
  title,
  description,
}: EventsListClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredEvents =
    selectedTags.length === 0
      ? events
      : events.filter((event) =>
          selectedTags.some((tag) => event.tags?.includes(tag))
        );

  // Insert sponsor carousels every 8 items
  const itemsWithAds: (EventItem | "sponsor")[] = [];
  for (let i = 0; i < filteredEvents.length; i++) {
    itemsWithAds.push(filteredEvents[i]);
    if ((i + 1) % 8 === 0 && i < filteredEvents.length - 1) {
      itemsWithAds.push("sponsor");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl">{title}</h1>
          <p className="text-blue-100 text-xl">{description}</p>
        </div>
      </section>

      {/* Filter & List */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Filter Button */}
          {tagOptions.length > 0 && (
            <div className="mb-6 flex justify-end">
              <TagFilter
                onTagChange={setSelectedTags}
                selectedTags={selectedTags}
                tags={tagOptions}
              />
            </div>
          )}

          {/* Grid */}
          {filteredEvents.length > 0 ? (
            <div className="space-y-8">
              {itemsWithAds.map((item, index) => {
                if (item === "sponsor") {
                  return (
                    <div className="py-4" key={`sponsor-${index}`}>
                      <SponsorCarousel sponsors={sponsors} />
                    </div>
                  );
                }

                const imageUrl = item.image?.url;

                return (
                  <Link
                    className="block"
                    href={`${basePath}/${item.id}`}
                    key={item.id}
                  >
                    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-col sm:flex-row">
                        {imageUrl && (
                          <div className="relative h-48 shrink-0 bg-gray-100 sm:h-32 sm:w-48">
                            <Image
                              alt={item.title}
                              className="object-cover transition-transform group-hover:scale-105"
                              fill
                              src={imageUrl}
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <h2 className="font-bold text-gray-800 text-lg transition-colors group-hover:text-blue-600">
                            {item.title}
                          </h2>
                          {item.location && (
                            <p className="mt-1 text-gray-500 text-sm">
                              📍 {item.location}
                            </p>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs"
                                  key={tag}
                                >
                                  {tagOptions.find((t) => t.value === tag)
                                    ?.label || tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              該当する項目がありません
            </div>
          )}
        </div>
      </section>

      {/* Sponsor Carousel */}
      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center font-medium text-gray-600 text-lg">
            協賛企業
          </h2>
          <SponsorCarousel sponsors={sponsors} />
        </div>
      </section>
    </div>
  );
}
