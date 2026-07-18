/* Produces a fully self-contained deploy in ../recover-standalone:
   index.html (inline CSS+JS), manifest, service worker, and an SVG icon.
   No binary assets, so it can be pushed as plain text and hosted anywhere. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, "../recover");
const out = path.resolve(root, "../recover-standalone");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const app = readFileSync(path.join(src, "app.js"), "utf8");
const css = readFileSync(path.join(src, "styles.css"), "utf8");
const icon = readFileSync(path.join(src, "icon.svg"), "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0" />
<meta name="theme-color" content="#337dff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0a1020" media="(prefers-color-scheme: dark)" />
<meta name="description" content="Recover+ — a calm, motivating companion for organising and tracking recovery from an ankle injury. For organisation and education only; it never replaces medical advice." />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Recover+" />
<title>Recover+ · Recovery Companion</title>
<link rel="manifest" href="manifest.webmanifest" />
<link rel="icon" href="icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="icon.svg" />
<style>${css}</style>
<script>
(function(){try{var s=localStorage.getItem("recoverplus.v1");var t="light";if(s){var d=JSON.parse(s);if(d&&d.settings&&d.settings.theme)t=d.settings.theme;}if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();
</script>
</head>
<body>
<noscript><div style="padding:2rem;font-family:system-ui;max-width:40rem;margin:auto"><h1>Recover+</h1><p>Please enable JavaScript and reload.</p></div></noscript>
<div id="root"></div>
<script>${app}</script>
<script>
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){});});}
</script>
</body>
</html>
`;

const manifest = {
  name: "Recover+ · Recovery Companion",
  short_name: "Recover+",
  description: "A calm, motivating companion for ankle-injury recovery. For organisation and education only — it never replaces medical advice.",
  start_url: "./", scope: "./", display: "standalone", orientation: "portrait",
  background_color: "#eaf2ff", theme_color: "#337dff",
  categories: ["health", "lifestyle", "medical"],
  icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }],
};

const sw = `const V="recoverplus-standalone-v1";const SHELL=["./","index.html","manifest.webmanifest","icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;if(r.mode==="navigate"){e.respondWith(fetch(r).catch(()=>caches.match("index.html").then(x=>x||caches.match("./"))));return;}e.respondWith(caches.match(r).then(c=>c||fetch(r)))});
`;

writeFileSync(path.join(out, "index.html"), html);
writeFileSync(path.join(out, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
writeFileSync(path.join(out, "sw.js"), sw);
writeFileSync(path.join(out, "icon.svg"), icon);
// A no-jekyll file so GitHub Pages serves files as-is.
writeFileSync(path.join(out, ".nojekyll"), "");
console.log("✓ standalone build →", out);
