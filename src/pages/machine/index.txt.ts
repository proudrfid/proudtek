import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute, BUILD_TIME_ISO } from "../../lib/site-data";
import { buildMachinePageText } from "../../lib/seo";

export const prerender = true;

export const GET: APIRoute = async () => {
  // warm the site-data cache used by getPageByRoute()
  await getSiteData();
  const page = await getPageByRoute("/");

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildMachinePageText(page, BUILD_TIME_ISO), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
