import type { APIRoute } from "astro";

import { getSiteData } from "../lib/site-data";
import { buildLlmsTxt } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(buildLlmsTxt(await getSiteData()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
