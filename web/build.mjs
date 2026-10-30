import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "docs"), { recursive: true });
for (const path of ["index.html", "act.html", "popup.js", "popup.css", "shared.js", "icons", "docs/preview.png"]) {
  await cp(join(root, path), join(dist, path), { recursive: true });
}
console.log("Production export: dist/ (original HTML, CSS, JavaScript and local assets).");
