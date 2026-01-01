import { headers as getHeaders } from "next/headers.js";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import { Button } from "@/components/ui/Button";
import config from "@/payload.config";

export const revalidate = 60;

export default async function HomePage() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });
  const mediaQuery = await payload.find({
    collection: "media",
    depth: 0,
    limit: 30,
    sort: "-createdAt",
  });

  const mediaItems = mediaQuery.docs;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            {!user && (
              <h1 className="font-semibold text-3xl text-gray-800">
                Welcome to your new project
              </h1>
            )}
            {!!user && (
              <h1 className="font-semibold text-3xl text-gray-800">
                Welcome back, {user.email}
              </h1>
            )}
            <p className="mt-1 text-gray-500 text-sm">
              Preview recently uploaded media below.
            </p>
          </div>
        </div>

        {mediaItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mediaItems.map((item, index) => {
              const width = item.width ?? 1200;
              const height = item.height ?? 800;
              const alt = item.alt || item.filename || "Uploaded media";

              if (!item.url) {
                return null;
              }

              return (
                <figure
                  className="overflow-hidden rounded-lg bg-white shadow transition-shadow duration-150 hover:shadow-lg"
                  key={item.id}
                >
                  <div className="h-48 w-full bg-gray-100">
                    <Image
                      alt={alt}
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      className="h-full w-full object-cover"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      height={height}
                      loading={index < 6 ? "eager" : "lazy"}
                      placeholder="blur"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 220px"
                      src={item.url}
                      width={width}
                    />
                  </div>
                  <figcaption className="p-3 text-center text-gray-600 text-sm">
                    {item.filename ?? "Uploaded media"}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-300 border-dashed bg-white py-12 text-center text-gray-500">
            Upload an image to the media collection to preview it here.
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-medium text-gray-800 text-xl">Get started</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Add media to see it appear in this gallery.
          </p>
        </div>
        <Link className="mt-4 inline-block" href="/admin">
          <Button variant="primary">Go to Admin Panel</Button>
        </Link>
      </div>
    </main>
  );
}
