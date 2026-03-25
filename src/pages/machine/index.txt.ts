import type { APIRoute } from "astro";

import { getSiteData } from "../../lib/site-data";
import { buildMachinePageText, getIndexablePages } from "../../lib/seo";

export const prerender = true;

export const GET: APIRoute = async () => {
  const siteData = await getSiteData();
  const page = getIndexablePages(siteData).find((entry) => entry.route === "/");

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildMachinePageText(page), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
