import { headers as getHeaders } from "next/headers.js";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import "./styles.css";

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
    <div className="home">
      <div className="content">
        {!user && <h1>Welcome to your new project.</h1>}
        {!!user && <h1>Welcome back, {user.email}</h1>}
        {mediaItems.length > 0 ? (
          <div className="mediaGrid">
            {mediaItems.map((item, index) => {
              const width = item.width ?? 1200;
              const height = item.height ?? 800;
              const alt = item.alt || item.filename || "Uploaded media";

              if (!item.url) {
                return null;
              }

              return (
                <figure className="mediaCard" key={item.id}>
                  <Image
                    alt={alt}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    fetchPriority={index === 0 ? "high" : "auto"}
                    height={height}
                    loading={index < 6 ? "eager" : "lazy"}
                    placeholder="blur"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 220px"
                    src={item.url}
                    width={width}
                  />
                  <figcaption className="caption">
                    {item.filename ?? "Uploaded media"}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ) : (
          <p className="placeholder">
            Upload an image to the media collection to preview it here.
          </p>
        )}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
