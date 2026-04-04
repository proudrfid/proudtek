import { g as getSiteData, r as routeToParam } from './site-data_DG-wjh5b.mjs';
import { g as getIndexablePages, b as buildMachinePageData } from './seo_B4NEz5S7.mjs';

const prerender = true;
async function getStaticPaths() {
  const siteData = await getSiteData();
  return getIndexablePages(siteData).filter((page) => page.route !== "/").map((page) => ({
    params: { slug: routeToParam(page.route) }
  }));
}
const GET = async ({ params }) => {
  const siteData = await getSiteData();
  const slug = params.slug;
  const route = slug ? `/${String(slug).replace(/^\/+|\/+$/g, "")}/` : "/";
  const page = getIndexablePages(siteData).find((entry) => entry.route === route);
  if (!page) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(JSON.stringify(buildMachinePageData(page), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  getStaticPaths,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
