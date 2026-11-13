import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The cart, checkout and chat API have nothing worth indexing.
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
