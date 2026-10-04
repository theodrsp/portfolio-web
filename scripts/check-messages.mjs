import { readFileSync } from "node:fs";

const load = (l) =>
  JSON.parse(readFileSync(new URL(`../apps/web/messages/${l}.json`, import.meta.url), "utf8"));
const keys = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    typeof v === "object" ? keys(v, `${p}${k}.`) : [`${p}${k}`],
  );

const id = keys(load("id"));
const en = keys(load("en"));
console.log("Hilang di en:", id.filter((k) => !en.includes(k)));
console.log("Hilang di id:", en.filter((k) => !id.includes(k)));
