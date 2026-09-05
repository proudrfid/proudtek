import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute, BUILD_TIME_ISO } from "../../lib/site-data";
import { buildMachinePageData } from "../../lib/seo";

export const prerender = true;

export const GET: APIRoute = async () => {
  // warm the site-data cache used by getPageByRoute()
  await getSiteData();
  const page = await getPageByRoute("/");

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(JSON.stringify(buildMachinePageData(page, BUILD_TIME_ISO), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
