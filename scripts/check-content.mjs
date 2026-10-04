const API = process.env.API_URL ?? "http://localhost:4000/api";
const BASES = ["headline", "bio", "teachingPhilosophy", "title", "summary", "description", "learningOutcomes"];

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

function check(label, obj) {
  for (const base of BASES) {
    const id = obj[`${base}Id`];
    const en = obj[`${base}En`];
    if (id === undefined && en === undefined) continue;
    if ((id && !en) || (!id && en)) console.log(`[KOSONG] ${label}: ${base}`);
    else if (id && id === en) console.log(`[SAMA]   ${label}: ${base} (isi Id dan En identik)`);
  }
}

check("profile", await get("/profile"));
for (const p of await get("/projects")) check(`project ${p.slug}`, p);
console.log("Selesai.");