import { c as createComponent, $ as $$SnapshotLayout } from './SnapshotLayout_DkM-Fec7.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate } from './prerender_C00rceLN.mjs';
import { a as getPageByRoute } from './site-data_DG-wjh5b.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const page = await getPageByRoute("/");
  if (!page) {
    throw new Error("Missing homepage snapshot. Run `npm run fetch` first.");
  }
  return renderTemplate`${renderComponent($$result, "SnapshotLayout", $$SnapshotLayout, { "page": page })}`;
}, "/Users/zhangping/Documents/Playground/.claude/worktrees/hopeful-chatterjee/src/pages/index.astro", void 0);

const $$file = "/Users/zhangping/Documents/Playground/.claude/worktrees/hopeful-chatterjee/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
