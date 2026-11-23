import type { MetadataRoute } from "next";
import { editorialPaths } from "@/lib/editorial";
import { siteUrl } from "@/lib/siteSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  return editorialPaths.map((path) => ({ url: siteUrl(path) }));
}
