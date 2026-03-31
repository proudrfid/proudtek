import type { APIRoute } from "astro";

import { getSiteData, getPageByRoute, routeToParam } from "../../lib/site-data";
import { buildMachinePageData, getIndexablePages } from "../../lib/seo";

export const prerender = true;

export async function getStaticPaths() {
  const siteData = await getSiteData();

  return getIndexablePages(siteData)
    .filter((page) => page.route !== "/")
    .map((page) => ({
      params: { slug: routeToParam(page.route) },
    }));
}

export const GET: APIRoute = async ({ params }) => {
  const siteData = await getSiteData();
  const slug = params.slug;
  const route = slug ? `/${String(slug).replace(/^\/+|\/+$/g, "")}/` : "/";
  const page = await getPageByRoute(route);

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(JSON.stringify(buildMachinePageData(page, siteData.generatedAt), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
