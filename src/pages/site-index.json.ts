import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute } from "../lib/site-data";
import { buildMachineRoute, buildPageSeo, buildPageSummary, getIndexablePages } from "../lib/seo";
import { absoluteUrl } from "../lib/seo/utils";

export const prerender = true;

export const GET: APIRoute = async () => {
  const siteData = await getSiteData();
  const indexable = getIndexablePages(siteData);

  const pages = [];
  for (const stub of indexable) {
    const page = await getPageByRoute(stub.route);
    if (!page) continue;

    const seo = buildPageSeo(page);
    const summary = buildPageSummary(page);

    pages.push({
      ...summary,
      imageUrl: seo.imageUrl,
      imageAlt: seo.imageAlt,
      machineJson: absoluteUrl(buildMachineRoute(page.route, "json")),
      machineText: absoluteUrl(buildMachineRoute(page.route, "txt")),
    });
  }

  return new Response(
    JSON.stringify(
      {
        site: "Proud Tek",
        generatedAt: siteData.generatedAt,
        pageCount: pages.length,
        pages,
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
};
