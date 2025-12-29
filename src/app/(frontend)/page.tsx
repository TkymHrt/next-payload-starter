import { fileURLToPath } from "node:url";
import { headers as getHeaders } from "next/headers.js";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import "./styles.css";

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

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`;

  return (
    <div className="home">
      <div className="content">
        {!user && <h1>Welcome to your new project.</h1>}
        {!!user && <h1>Welcome back, {user.email}</h1>}
        {mediaItems.length > 0 ? (
          <div className="mediaGrid">
            {mediaItems.map((item) => {
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
                    height={height}
                    sizes="(max-width: 768px) 100vw, 480px"
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
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  );
}
