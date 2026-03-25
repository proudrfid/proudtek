import type { APIRoute } from "astro";

import { getSiteData } from "../lib/site-data";
import { buildImageSitemapXml } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(buildImageSitemapXml(await getSiteData()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
