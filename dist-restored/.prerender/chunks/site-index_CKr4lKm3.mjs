import { g as getSiteData } from './site-data_DG-wjh5b.mjs';
import { g as getIndexablePages, c as buildPageSeo, d as buildPageSummary, e as buildMachineRoute } from './seo_B4NEz5S7.mjs';

const prerender = true;
const GET = async () => {
  const siteData = await getSiteData();
  const pages = getIndexablePages(siteData).map((page) => {
    const seo = buildPageSeo(page);
    const summary = buildPageSummary(page);
    return {
      ...summary,
      imageUrl: seo.imageUrl,
      imageAlt: seo.imageAlt,
      machineJson: `https://proudtek.com${buildMachineRoute(page.route, "json")}`,
      machineText: `https://proudtek.com${buildMachineRoute(page.route, "txt")}`
    };
  });
  return new Response(
    JSON.stringify(
      {
        site: "Proud Tek",
        generatedAt: siteData.generatedAt,
        pageCount: pages.length,
        pages
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
