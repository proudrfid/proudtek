import type { APIRoute } from "astro";

import { getSiteData } from "../lib/site-data";
import { buildSitemapIndexXml } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(buildSitemapIndexXml((await getSiteData()).generatedAt), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
