import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute } from "../lib/site-data";
import { buildSitemapXml } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(await buildSitemapXml(await getSiteData(), (route) => getPageByRoute(route).then((p) => p!)), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
