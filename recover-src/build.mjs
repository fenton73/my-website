import esbuild from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, copyFileSync, readdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(root, "../recover");
const iconsDir = path.join(out, "icons");

rmSync(out, { recursive: true, force: true });
mkdirSync(iconsDir, { recursive: true });

// 1) Bundle the app -------------------------------------------------------
await esbuild.build({
  entryPoints: [path.join(root, "src/main.tsx")],
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: ["es2019"],
  jsx: "automatic",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: path.join(out, "app.js"),
  legalComments: "none",
});
console.log("✓ bundled app.js");

// 2) Compile Tailwind -----------------------------------------------------
execSync(
  `npx tailwindcss -c "${path.join(root, "tailwind.config.js")}" -i "${path.join(root, "src/index.css")}" -o "${path.join(out, "styles.css")}" --minify`,
  { stdio: "inherit", cwd: root }
);
console.log("✓ compiled styles.css");

// 3) Copy static public assets -------------------------------------------
const pub = path.join(root, "public");
for (const f of readdirSync(pub)) copyFileSync(path.join(pub, f), path.join(out, f));
console.log("✓ copied public assets");

// 4) Generate PWA icons from an SVG --------------------------------------
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#337dff"/><stop offset="1" stop-color="#12c98a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <path d="M256 392c-8 0-16-3-22-9l-96-96c-30-30-30-79 0-109 28-28 73-30 103-6 30-24 75-22 103 6 30 30 30 79 0 109l-96 96c-6 6-14 9-22 9z" fill="#fff" opacity=".96"/>
  <path d="M182 250h40l20-40 30 84 22-52 14 24h42" fill="none" stroke="#337dff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#337dff"/><stop offset="1" stop-color="#12c98a"/></linearGradient></defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <path d="M256 372c-7 0-14-3-19-8l-84-84c-26-26-26-69 0-95 25-25 64-26 90-5 26-21 65-20 90 5 26 26 26 69 0 95l-84 84c-5 5-12 8-19 8z" fill="#fff" opacity=".96"/>
</svg>`;

async function png(svgStr, size, file) {
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(path.join(iconsDir, file));
}
await png(svg(512), 192, "icon-192.png");
await png(svg(512), 512, "icon-512.png");
await png(svg(512), 180, "apple-touch-icon.png");
await png(maskable, 512, "maskable-512.png");
// favicon
await sharp(Buffer.from(svg(512))).resize(64, 64).png().toFile(path.join(out, "favicon.png"));
writeFileSync(path.join(out, "icon.svg"), svg(512));
console.log("✓ generated icons");

console.log("\nBuild complete →", out);
