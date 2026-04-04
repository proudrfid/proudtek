import { g as getSiteData } from './site-data_DG-wjh5b.mjs';
import { e as buildSitemapXml } from './seo-feeds_DTt6Kwxt.mjs';

const prerender = true;
const GET = async () => new Response(buildSitemapXml(await getSiteData()), {
  headers: {
    "Content-Type": "application/xml; charset=utf-8"
  }
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
