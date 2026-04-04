import { g as getSiteData } from './site-data_DG-wjh5b.mjs';
import { g as getIndexablePages, b as buildMachinePageData } from './seo_B4NEz5S7.mjs';

const prerender = true;
const GET = async () => {
  const siteData = await getSiteData();
  const page = getIndexablePages(siteData).find((entry) => entry.route === "/");
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
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
