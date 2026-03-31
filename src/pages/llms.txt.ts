import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute } from "../lib/site-data";
import { buildLlmsTxt } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(await buildLlmsTxt(await getSiteData(), (route) => getPageByRoute(route).then((p) => p!)), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
