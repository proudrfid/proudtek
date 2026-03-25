import type { APIRoute } from "astro";

import { getSiteData } from "../lib/site-data";
import { buildLlmsFullTxt } from "../lib/seo-feeds";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(buildLlmsFullTxt(await getSiteData()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
