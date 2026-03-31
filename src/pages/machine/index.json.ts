import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute } from "../../lib/site-data";
import { buildMachinePageData } from "../../lib/seo";

export const prerender = true;

export const GET: APIRoute = async () => {
  const siteData = await getSiteData();
  const page = await getPageByRoute("/");

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(JSON.stringify(buildMachinePageData(page, siteData.generatedAt), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
