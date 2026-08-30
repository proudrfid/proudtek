#!/usr/bin/env node
/**
 * IndexNow bulk ping — submits sitemap URLs to api.indexnow.org (Bing/
 * DuckDuckGo/Yandex ecosystem). Run AFTER deploy: `node scripts/indexnow-ping.mjs`.
 * Reads live sitemap so newly added routes are included automatically.
 */
import { readFileSync } from "node:fs";

const KEY_FILE = "public/indexnow-key.txt";
const SITEMAP = "https://proudtek.com/sitemap.xml";
const HOST = "proudtek.com";
const KEY = readFileSync(KEY_FILE, "utf8").trim();
const keyLocation = `https://proudtek.com/${KEY}.txt`;

const xml = await (await fetch(SITEMAP, { redirect: "follow" })).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("no URLs parsed from sitemap");

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation, urlList }),
});
console.log(`[indexnow] submitted ${urlList.length} URLs -> HTTP ${res.status} (${res.status === 200 || res.status === 202 ? "accepted" : "check key/URL"})`);
if (!res.ok) console.log(await res.text());
