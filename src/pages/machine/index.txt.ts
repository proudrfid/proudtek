import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute } from "../../lib/site-data";
import { buildMachinePageText } from "../../lib/seo";

export const prerender = true;

export const GET: APIRoute = async () => {
  const siteData = await getSiteData();
  const page = await getPageByRoute("/");

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildMachinePageText(page, siteData.generatedAt), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
