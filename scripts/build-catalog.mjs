// Niloosa catalog generator.
//
// Assembles 500+ genuinely public-domain works spanning art movements — plus
// Persian miniature and Islamic calligraphy — and writes a typed, committed
// src/data/paintings.ts. Two reliable sources, NO per-image fetching (so we never
// trip a CDN rate limiter):
//
//   1. Wikidata SPARQL  — paintings by movement / creator / genre, with labels.
//   2. Commons category API — historical Persian/Islamic/East-Asian art.
//
// Image URLs are computed deterministically as 1280px Commons thumbnails on
// upload.wikimedia.org (already allow-listed in the CSP). 1280 is a standard
// pre-cached width; odd widths 400 on direct hotlink, so we always use 1280.
//
//   node scripts/build-catalog.mjs

import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const UA = "Niloosa-Catalog/1.0 (hand-painted-art commissioning; contact dev@niloosa.app)";
const SPARQL = "https://query.wikidata.org/sparql";
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const TOTAL_CAP = 560; // lean but comfortably >500; diversity buckets run first
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 1280px Commons thumbnail URL, computed from a bare file name (no fetch). */
function commonsThumb(name) {
  const f = name.replace(/ /g, "_");
  const md5 = crypto.createHash("md5").update(f).digest("hex");
  const enc = encodeURIComponent(f);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${enc}/1280px-${enc}`;
}

async function getJson(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
      if (res.status === 429 || res.status >= 500) {
        await sleep(1500 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      await sleep(700 * (i + 1));
    }
  }
  return null;
}

async function sparql(where, limit) {
  const q = `SELECT ?itemLabel ?creatorLabel ?image WHERE {
    ${where}
    OPTIONAL { ?item wdt:P170 ?creator. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  } LIMIT ${limit}`;
  const data = await getJson(`${SPARQL}?format=json&query=${encodeURIComponent(q)}`);
  const out = [];
  for (const b of data?.results?.bindings || []) {
    const raw = b.image?.value || "";
    const fname = decodeURIComponent(raw.split("/Special:FilePath/")[1] || "");
    if (!fname) continue;
    out.push({
      title: b.itemLabel?.value || "",
      artist: b.creatorLabel?.value || "",
      file: fname,
    });
  }
  return out;
}

async function commonsCat(title, limit) {
  const url = `${COMMONS}?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(
    title
  )}&cmtype=file&cmlimit=${limit}&format=json&origin=*`;
  const data = await getJson(url);
  return (data?.query?.categorymembers || [])
    .map((m) => m.title.replace(/^File:/, ""))
    .filter((f) => /\.(jpe?g|png)$/i.test(f));
}

// --- Wikidata buckets ---------------------------------------------------------
// P170 = creator, P135 = movement, P136 = genre, P31 Q3305213 = painting.
const P = (id) => `wd:${id}`;
const creator = (qid) => `?item wdt:P170 ${P(qid)}; wdt:P18 ?image; wdt:P31 wd:Q3305213.`;
const movement = (qid) => `?item wdt:P135 ${P(qid)}; wdt:P18 ?image; wdt:P31 wd:Q3305213.`;
const genre = (qid) => `?item wdt:P136 ${P(qid)}; wdt:P18 ?image; wdt:P31 wd:Q3305213.`;

const WD = [
  // --- One bucket per movement FIRST, so every style survives the total cap ---
  { where: creator("Q296"), style: "impressionism", category: "landscape", tones: ["cool", "muted"], complexity: "involved", cap: 30 },
  { where: creator("Q5582"), style: "post-impressionism", category: "landscape", tones: ["vivid", "warm"], complexity: "involved", cap: 30 },
  { where: creator("Q34013"), style: "pointillism", category: "figures", tones: ["muted", "cool"], complexity: "intricate", cap: 16 },
  { where: creator("Q5598"), style: "baroque", category: "portrait", tones: ["earthy", "warm"], complexity: "intricate", cap: 28 },
  { where: creator("Q41264"), style: "dutch-golden-age", category: "figures", tones: ["cool", "muted"], complexity: "intricate", cap: 18 },
  { where: creator("Q297"), style: "renaissance", category: "portrait", tones: ["earthy", "muted"], complexity: "intricate", cap: 20 },
  { where: creator("Q159758"), style: "romanticism", category: "landscape", tones: ["cool", "warm"], complexity: "involved", cap: 24 },
  { where: creator("Q34618"), style: "realism", category: "landscape", tones: ["earthy", "muted"], complexity: "involved", cap: 22 },
  { where: creator("Q34661"), style: "symbolism", category: "figures", tones: ["vivid", "warm"], complexity: "intricate", cap: 18 },
  { where: creator("Q155626"), style: "portraiture", category: "portrait", tones: ["muted", "warm"], complexity: "involved", cap: 24 },
  { where: creator("Q5586"), style: "ukiyo-e", category: "landscape", tones: ["cool", "vivid"], complexity: "simple", cap: 26 },
  { where: movement("Q122960"), style: "rococo", category: "figures", tones: ["warm", "vivid"], complexity: "involved", cap: 22 },
  // --- Fills: more artists per movement, for depth ---
  { where: creator("Q39931"), style: "impressionism", category: "figures", tones: ["warm", "muted"], complexity: "involved", cap: 26 },
  { where: creator("Q46373"), style: "impressionism", category: "figures", tones: ["muted", "warm"], complexity: "involved", cap: 22 },
  { where: creator("Q134741"), style: "impressionism", category: "landscape", tones: ["earthy", "cool"], complexity: "involved", cap: 20 },
  { where: creator("Q37693"), style: "post-impressionism", category: "figures", tones: ["vivid", "warm"], complexity: "involved", cap: 22 },
  { where: creator("Q35548"), style: "post-impressionism", category: "still-life", tones: ["earthy", "muted"], complexity: "involved", cap: 22 },
  { where: creator("Q167654"), style: "dutch-golden-age", category: "portrait", tones: ["earthy", "muted"], complexity: "involved", cap: 18 },
  { where: creator("Q205863"), style: "dutch-golden-age", category: "figures", tones: ["warm", "earthy"], complexity: "involved", cap: 18 },
  { where: creator("Q42207"), style: "baroque", category: "figures", tones: ["earthy", "warm"], complexity: "intricate", cap: 18 },
  { where: creator("Q5432"), style: "romanticism", category: "figures", tones: ["muted", "earthy"], complexity: "involved", cap: 22 },
  { where: creator("Q148458"), style: "realism", category: "figures", tones: ["earthy", "muted"], complexity: "involved", cap: 16 },
  { where: creator("Q104884"), style: "romanticism", category: "landscape", tones: ["cool", "muted"], complexity: "involved", cap: 14 },
  { where: creator("Q212657"), style: "symbolism", category: "figures", tones: ["muted", "cool"], complexity: "involved", cap: 14 },
  { where: movement("Q37853"), style: "baroque", category: "figures", tones: ["earthy", "warm"], complexity: "intricate", cap: 22 },
  { where: movement("Q4692"), style: "renaissance", category: "figures", tones: ["muted", "warm"], complexity: "intricate", cap: 20 },
];

// Diversity buckets — run BEFORE the big movement list so still-life, animals,
// floral and abstract categories are guaranteed a place in the catalog.
const DIVERSITY = [
  { where: genre("Q170571"), style: "still-life-tradition", category: "still-life", tones: ["earthy", "muted"], complexity: "involved", cap: 40 },
  { where: genre("Q16875712"), style: "naturalism", category: "animals", tones: ["earthy", "warm"], complexity: "involved", cap: 34 },
  { where: creator("Q1057105"), style: "still-life-tradition", category: "floral", tones: ["muted", "vivid"], complexity: "involved", cap: 24 },
  { where: genre("Q1136637"), style: "botanical", category: "floral", tones: ["vivid", "warm"], complexity: "involved", cap: 24 },
  { where: creator("Q313421"), style: "botanical", category: "floral", tones: ["muted", "warm"], complexity: "intricate", cap: 20 },
];

// --- Commons category buckets (Persian / Islamic / East-Asian) -----------------
const CC = [
  { cats: ["Persian miniatures", "Safavid miniatures", "Qajar miniatures"], style: "persian-miniature", category: "figures", tones: ["vivid", "earthy"], complexity: "intricate", artist: "Persian master", cap: 34 },
  { cats: ["Islamic calligraphy", "Persian calligraphy", "Nastaʿlīq"], style: "islamic-calligraphy", category: "calligraphy", tones: ["earthy", "muted"], complexity: "intricate", artist: "Islamic calligrapher", cap: 30 },
  { cats: ["Chinese paintings", "Landscape paintings of China"], style: "chinese-painting", category: "landscape", tones: ["muted", "earthy"], complexity: "involved", artist: "Chinese master", cap: 22 },
  { cats: ["Ukiyo-e", "Woodblock prints by Utagawa Hiroshige"], style: "ukiyo-e", category: "figures", tones: ["muted", "vivid"], complexity: "simple", artist: "Ukiyo-e master", cap: 24 },
  { cats: ["Paintings of flowers", "Bouquets in art"], style: "botanical", category: "floral", tones: ["vivid", "warm"], complexity: "involved", artist: "Unknown maker", cap: 30 },
];

// Public-domain 20th-century abstraction (authors died >70y ago).
const ABSTRACT = [
  { title: "Composition VII", artist: "Wassily Kandinsky", file: "Composition VII - Wassily Kandinsky, GAC.jpg", tone: "vivid", complexity: "intricate" },
  { title: "Color Study: Squares with Concentric Circles", artist: "Wassily Kandinsky", file: "Vassily Kandinsky, 1913 - Color Study, Squares with Concentric Circles.jpg", tone: "vivid", complexity: "simple" },
  { title: "Suprematist Composition", artist: "Kazimir Malevich", file: "Suprematist Composition - Kazimir Malevich.jpg", tone: "muted", complexity: "simple" },
  { title: "The Ten Largest, No. 4, Youth", artist: "Hilma af Klint", file: "Hilma af Klint - The Ten Largest No. 4 - Youth - 1907.jpg", tone: "cool", complexity: "involved" },
  { title: "Simultaneous Contrasts: Sun and Moon", artist: "Robert Delaunay", file: "Robert Delaunay - Simultaneous Contrasts-Sun and Moon - 1912.jpg", tone: "vivid", complexity: "involved" },
  { title: "Composition II in Red, Blue, and Yellow", artist: "Piet Mondrian", file: "Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg", tone: "vivid", complexity: "simple" },
  { title: "The Yellow Cow", artist: "Franz Marc", file: "Franz Marc-The Yellow Cow-1911.jpg", tone: "warm", complexity: "involved" },
  { title: "Senecio", artist: "Paul Klee", file: "Paul Klee, Senecio (Baldgreis), 1922.jpg", tone: "warm", complexity: "simple" },
];

const BADWORD = /(coin|münze|map\b|diagram|logo|icon|seal|stamp|banknote|chart|sketch map|svg|\.tif|font|alphabet|keyboard|table of|inscription stone)/i;
const strHash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function cleanTitle(t, fallbackFile) {
  let s = (t || "").trim();
  if (!s || /^Q\d+$/.test(s)) {
    s = (fallbackFile || "Untitled").replace(/\.(jpe?g|png)$/i, "").replace(/_/g, " ");
  }
  return s.replace(/\s+/g, " ").replace(/["\\]/g, "").trim().slice(0, 90) || "Untitled";
}
const cleanArtist = (a) => (a && !/^Q\d+$/.test(a) ? a : "").replace(/["\\]/g, "").trim().slice(0, 70);

function refineComplexity(base, hay) {
  const c = hay.toLowerCase();
  if (/(print|woodblock|drawing|etching|lithograph|sketch)/.test(c)) return "simple";
  if (/(illumination|miniature|manuscript|folio|calligraph|nastaliq|quran|shahnama)/.test(c)) return "intricate";
  return base;
}

async function main() {
  const seenFiles = new Set();
  const seenKeys = new Set();
  const collected = [];

  const add = (row) => {
    if (collected.length >= TOTAL_CAP) return false;
    const fileKey = row.file.replace(/ /g, "_").toLowerCase();
    if (seenFiles.has(fileKey)) return false;
    const key = `${row.title}|${row.artist}`.toLowerCase();
    if (seenKeys.has(key)) return false;
    if (BADWORD.test(row.file) || BADWORD.test(row.title)) return false;
    seenFiles.add(fileKey);
    seenKeys.add(key);
    collected.push(row);
    return true;
  };

  async function runWd(list, tag) {
    for (const b of list) {
      const rows = await sparql(b.where, b.cap * 2);
      let kept = 0;
      for (const r of rows) {
        if (kept >= b.cap) break;
        const title = cleanTitle(r.title, r.file);
        const artist = cleanArtist(r.artist) || "Unknown maker";
        const tone = b.tones[strHash(r.file) % b.tones.length];
        if (add({ title, artist, file: r.file, category: b.category, tone, complexity: refineComplexity(b.complexity, `${title} ${r.file}`), style: b.style }))
          kept++;
      }
      console.log(`${tag} ${b.style.padEnd(20)} → +${kept} (total ${collected.length})`);
      await sleep(200);
    }
  }

  // Commons categories FIRST — Persian miniature, Islamic calligraphy, etc. must
  // never be starved by the larger European movement buckets.
  for (const b of CC) {
    let kept = 0;
    for (const cat of b.cats) {
      if (kept >= b.cap) break;
      const files = await commonsCat(cat, 60);
      for (const f of files) {
        if (kept >= b.cap) break;
        const title = cleanTitle("", f);
        const tone = b.tones[strHash(f) % b.tones.length];
        if (add({ title, artist: b.artist, file: f, category: b.category, tone, complexity: refineComplexity(b.complexity, `${title} ${f}`), style: b.style }))
          kept++;
      }
      await sleep(200);
    }
    console.log(`CC  ${b.style.padEnd(20)} → +${kept} (total ${collected.length})`);
  }

  // Diversity (still-life / animals / floral), then abstract, then the movements.
  await runWd(DIVERSITY, "DV");
  for (const a of ABSTRACT)
    add({ title: a.title, artist: a.artist, file: a.file, category: "abstract", tone: a.tone, complexity: a.complexity, style: "modern-abstract" });
  await runWd(WD, "WD");

  console.log(`\nTotal collected: ${collected.length}`);

  const rows = collected
    .map((p, i) => {
      const img = commonsThumb(p.file);
      return `  { id: ${i + 1}, title: ${JSON.stringify(p.title)}, artist: ${JSON.stringify(p.artist)}, file: "", img: ${JSON.stringify(img)}, category: ${JSON.stringify(p.category)}, tone: ${JSON.stringify(p.tone)}, complexity: ${JSON.stringify(p.complexity)}, style: ${JSON.stringify(p.style)} },`;
    })
    .join("\n");

  const styles = [...new Set(collected.map((p) => p.style))].sort();
  const styleUnion = styles.map((s) => `  | ${JSON.stringify(s)}`).join("\n");

  const out = `// Curated public-domain catalog — GENERATED by scripts/build-catalog.mjs.
// Do not hand-edit; re-run the script to regenerate. Every image is a hot-linkable
// 1280px public-domain thumbnail on upload.wikimedia.org (Wikimedia Commons —
// allow-listed in the image CSP). Works span art movements plus Persian miniature
// and Islamic calligraphy.
//
// \`category\` is the subject, \`tone\` the dominant palette, \`style\` the art movement,
// \`complexity\` how demanding it is to hand-paint (feeds pricing alongside size).

export type Category =
  | "landscape"
  | "portrait"
  | "floral"
  | "still-life"
  | "figures"
  | "animals"
  | "abstract"
  | "calligraphy";

export type Tone = "warm" | "cool" | "earthy" | "vivid" | "muted";

export type Complexity = "simple" | "involved" | "intricate";

export type Style =
${styleUnion};

export interface Painting {
  id: number;
  title: string;
  artist: string;
  file: string; // legacy Met CRDImages file id (empty for all generated entries)
  img?: string; // full image URL
  category: Category;
  tone: Tone;
  complexity: Complexity;
  style: Style;
}

// Legacy European-Paintings web-large helper, kept for the few places that still
// pass a bare Met file id (e.g. the About page's style exemplars).
export const metImage = (file: string) =>
  \`https://images.metmuseum.org/CRDImages/ep/web-large/\${file}.jpg\`;

/** Resolve a painting's image URL: an explicit \`img\`, else its legacy Met file id. */
export const imageOf = (p: Painting) => p.img ?? metImage(p.file);

export const PAINTINGS: Painting[] = [
${rows}
];
`;

  const here = path.dirname(fileURLToPath(import.meta.url));
  const dest = path.join(here, "..", "src", "data", "paintings.ts");
  await writeFile(dest, out, "utf8");
  console.log(`\nWrote ${collected.length} paintings → ${dest}`);
  console.log(`Styles (${styles.length}): ${styles.join(", ")}`);
  const byCat = {};
  for (const p of collected) byCat[p.category] = (byCat[p.category] || 0) + 1;
  console.log("By category:", byCat);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
