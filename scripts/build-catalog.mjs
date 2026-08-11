// Niloosa catalog generator.
//
// Assembles 500+ genuinely public-domain works spanning Western art movements plus
// Chinese painting and ukiyo-e, and writes a typed, committed src/data/paintings.ts.
// Persian and Islamic works are intentionally excluded. Two reliable sources, with
// NO per-image fetching (so we never trip a CDN rate limiter):
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
const depicts = (qid) => `?item wdt:P180 ${P(qid)}; wdt:P170 ?c; wdt:P18 ?image; wdt:P31 wd:Q3305213.`;
const DIVERSITY = [
  { where: genre("Q170571"), style: "still-life-tradition", category: "still-life", tones: ["earthy", "muted"], complexity: "involved", cap: 40 },
  { where: genre("Q16875712"), style: "naturalism", category: "animals", tones: ["earthy", "warm"], complexity: "involved", cap: 34 },
  { where: depicts("Q506"), style: "botanical", category: "floral", tones: ["vivid", "warm"], complexity: "involved", cap: 44 }, // depicts: flower
];

// Commons category sourcing is disabled: those categories mix in prints, drawings
// and other non-paintings. Everything now comes from Wikidata with P31 = painting
// (Q3305213), which draws real paintings from every collection Wikimedia knows —
// Rijksmuseum, NGA, the Met, Google Art Project and hundreds more.
const CC = [];

// The original hand-curated set — recognizable masterpieces the site opened with.
// These lead the catalog (ids 1..N). Met entries carry a CRDImages file id resolved
// through the European-Paintings web-large path; the abstract set carries a full
// Commons URL. All are named painters and genuine paintings.
const metImg = (f) => `https://images.metmuseum.org/CRDImages/ep/web-large/${f}.jpg`;
const CURATED = [
  { title: "Wheat Field with Cypresses", artist: "Vincent van Gogh", img: metImg("DP-42549-001"), category: "landscape", tone: "vivid", complexity: "involved", style: "post-impressionism" },
  { title: "Irises", artist: "Vincent van Gogh", img: metImg("DP346474"), category: "floral", tone: "cool", complexity: "involved", style: "post-impressionism" },
  { title: "The Card Players", artist: "Paul Cézanne", img: metImg("DP231550"), category: "figures", tone: "earthy", complexity: "involved", style: "post-impressionism" },
  { title: "Circus Sideshow", artist: "Georges Seurat", img: metImg("DP375450_cropped"), category: "figures", tone: "muted", complexity: "intricate", style: "pointillism" },
  { title: "The Monet Family in Their Garden", artist: "Édouard Manet", img: metImg("DP-25465-001"), category: "figures", tone: "vivid", complexity: "involved", style: "impressionism" },
  { title: "The Horse Fair", artist: "Rosa Bonheur", img: metImg("DP-23550-001"), category: "animals", tone: "earthy", complexity: "intricate", style: "realism" },
  { title: "The Death of Socrates", artist: "Jacques-Louis David", img: metImg("DP-13139-001"), category: "figures", tone: "warm", complexity: "intricate", style: "neoclassicism" },
  { title: "The Forest in Winter at Sunset", artist: "Théodore Rousseau", img: metImg("DP-31520-001"), category: "landscape", tone: "muted", complexity: "involved", style: "romanticism" },
  { title: "L'Arlésienne", artist: "Vincent van Gogh", img: metImg("DT1396"), category: "portrait", tone: "warm", complexity: "simple", style: "post-impressionism" },
  { title: "Shoes", artist: "Vincent van Gogh", img: metImg("DT1947"), category: "still-life", tone: "earthy", complexity: "simple", style: "post-impressionism" },
  { title: "Ia Orana Maria", artist: "Paul Gauguin", img: metImg("DT1025"), category: "figures", tone: "vivid", complexity: "involved", style: "post-impressionism" },
  { title: "Madame Cézanne in a Red Dress", artist: "Paul Cézanne", img: metImg("DP320128"), category: "portrait", tone: "warm", complexity: "involved", style: "post-impressionism" },
  { title: "Madame Charpentier and Her Children", artist: "Auguste Renoir", img: metImg("DP-35674-001"), category: "portrait", tone: "muted", complexity: "intricate", style: "impressionism" },
  { title: "The House with the Cracked Walls", artist: "Paul Cézanne", img: metImg("DT1943"), category: "landscape", tone: "earthy", complexity: "involved", style: "post-impressionism" },
  { title: "The French Comedians", artist: "Antoine Watteau", img: metImg("DP120381"), category: "figures", tone: "muted", complexity: "involved", style: "rococo" },
  { title: "Christ Blessing", artist: "Gerard David", img: metImg("DP218061"), category: "portrait", tone: "cool", complexity: "simple", style: "renaissance" },
  { title: "The Harvesters", artist: "Pieter Bruegel the Elder", img: metImg("DP119115"), category: "landscape", tone: "earthy", complexity: "intricate", style: "renaissance" },
  { title: "The Penitence of Saint Jerome", artist: "Joachim Patinir", img: metImg("DT5549"), category: "landscape", tone: "cool", complexity: "intricate", style: "renaissance" },
  { title: "Portrait of a Man", artist: "Velázquez", img: metImg("DP276131"), category: "portrait", tone: "muted", complexity: "simple", style: "baroque" },
  { title: "Young Woman with a Pink", artist: "Hans Memling", img: metImg("DP-45396-001"), category: "portrait", tone: "cool", complexity: "involved", style: "renaissance" },
  { title: "Madame Jacques-Louis Leblanc", artist: "J. A. D. Ingres", img: metImg("DT1926"), category: "portrait", tone: "muted", complexity: "involved", style: "neoclassicism" },
  { title: "Don Andrés de Andrade y la Cal", artist: "Bartolomé Estebán Murillo", img: metImg("DP-16333-001"), category: "portrait", tone: "warm", complexity: "involved", style: "baroque" },
  { title: "Marie Emilie Coignet de Courson with a Dog", artist: "Jean-Honoré Fragonard", img: metImg("DP-1019-01"), category: "portrait", tone: "warm", complexity: "involved", style: "rococo" },
  { title: "Basket of Flowers", artist: "Eugène Delacroix", img: metImg("DP-14347-001"), category: "floral", tone: "vivid", complexity: "involved", style: "romanticism" },
  { title: "Still Life with Flowers and Fruit", artist: "Henri Fantin-Latour", img: metImg("DT1980"), category: "floral", tone: "muted", complexity: "involved", style: "realism" },
  { title: "A Bouquet of Flowers", artist: "Clara Peeters", img: metImg("DP-19451-001"), category: "floral", tone: "earthy", complexity: "intricate", style: "dutch-golden-age" },
  { title: "Still Life with Flowers and Prickly Pears", artist: "Auguste Renoir", img: metImg("DP257756"), category: "floral", tone: "vivid", complexity: "involved", style: "impressionism" },
  { title: "Still Life with a Skull and a Writing Quill", artist: "Pieter Claesz", img: metImg("DP145929"), category: "still-life", tone: "earthy", complexity: "simple", style: "dutch-golden-age" },
  { title: "Still Life with Oysters and Glassware", artist: "Willem Claesz Heda", img: metImg("DP120415"), category: "still-life", tone: "muted", complexity: "intricate", style: "dutch-golden-age" },
  { title: "Still Life with Apples and a Pitcher", artist: "Camille Pissarro", img: metImg("DP-21958-001"), category: "still-life", tone: "earthy", complexity: "simple", style: "impressionism" },
  { title: "Still Life with Teapot and Fruit", artist: "Paul Gauguin", img: metImg("DT1027"), category: "still-life", tone: "warm", complexity: "simple", style: "post-impressionism" },
  { title: "Still Life", artist: "Georg Flegel", img: metImg("DP-25893-001"), category: "still-life", tone: "earthy", complexity: "intricate", style: "dutch-golden-age" },
  { title: "Dog Guarding Dead Game", artist: "Jean-Baptiste Oudry", img: metImg("DP356140"), category: "animals", tone: "earthy", complexity: "involved", style: "rococo" },
  { title: "Equestrian Portrait with Tutor and Coachman", artist: "Aelbert Cuyp", img: metImg("DP146442"), category: "animals", tone: "warm", complexity: "intricate", style: "dutch-golden-age" },
  { title: "A Maid Asleep", artist: "Johannes Vermeer", img: metImg("DP355525"), category: "figures", tone: "warm", complexity: "involved", style: "dutch-golden-age" },
  { title: "Two Children Teasing a Cat", artist: "Annibale Carracci", img: metImg("DP243404"), category: "figures", tone: "muted", complexity: "simple", style: "baroque" },
  { title: "Composition VII", artist: "Wassily Kandinsky", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg/1280px-Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg", category: "abstract", tone: "vivid", complexity: "intricate", style: "modern-abstract" },
  { title: "Squares with Concentric Circles", artist: "Wassily Kandinsky", img: "https://upload.wikimedia.org/wikipedia/commons/9/98/Vassily_Kandinsky%2C_1913_-_Color_Study%2C_Squares_with_Concentric_Circles.jpg", category: "abstract", tone: "vivid", complexity: "simple", style: "modern-abstract" },
  { title: "Suprematist Composition", artist: "Kazimir Malevich", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Suprematist_Composition_-_Kazimir_Malevich.jpg/1280px-Suprematist_Composition_-_Kazimir_Malevich.jpg", category: "abstract", tone: "muted", complexity: "simple", style: "modern-abstract" },
  { title: "The Ten Largest, No. 4, Youth", artist: "Hilma af Klint", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg/1280px-Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg", category: "abstract", tone: "cool", complexity: "involved", style: "modern-abstract" },
  { title: "Simultaneous Contrasts: Sun and Moon", artist: "Robert Delaunay", img: "https://upload.wikimedia.org/wikipedia/commons/d/df/Robert_Delaunay_-_Simultaneous_Contrasts-Sun_and_Moon_-_1912.jpg", category: "abstract", tone: "vivid", complexity: "involved", style: "modern-abstract" },
  { title: "Castle and Sun", artist: "Paul Klee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Burg_und_Sonne_-_Klee.jpg/1280px-Burg_und_Sonne_-_Klee.jpg", category: "abstract", tone: "warm", complexity: "simple", style: "modern-abstract" },
  { title: "Composition II in Red, Blue, and Yellow", artist: "Piet Mondrian", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/1280px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg", category: "abstract", tone: "vivid", complexity: "simple", style: "modern-abstract" },
  { title: "The Yellow Cow", artist: "Franz Marc", img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Franz_Marc-The_Yellow_Cow-1911.jpg", category: "abstract", tone: "warm", complexity: "involved", style: "modern-abstract" },
];

const BADWORD = /(coin|münze|map\b|diagram|logo|icon|seal|stamp|banknote|chart|sketch map|svg|\.tif|font|alphabet|keyboard|table of|inscription stone|cover|frontispiece|title page|bookplate|ex[- ]?libris|dust jacket|poster|playing card|postcard|magazine|album|leaflet|brochure|pamphlet|newspaper|advertisement)/i;
const strHash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function cleanTitle(t, fallbackFile) {
  let s = (t || "").trim();
  if (!s || /^Q\d+$/.test(s)) {
    s = (fallbackFile || "Untitled").replace(/\.(jpe?g|png)$/i, "").replace(/_/g, " ");
  }
  return s.replace(/\s+/g, " ").replace(/["\\]/g, "").trim().slice(0, 90) || "Untitled";
}
const cleanArtist = (a) => (a && !/^Q\d+$/.test(a) ? a : "").replace(/["\\]/g, "").trim().slice(0, 70);

/**
 * Pull the painter out of a "<Title> by <Painter>" name (common in Commons file
 * names) and hand back a clean title + the extracted artist. Trailing dates,
 * parentheticals and catalogue codes are trimmed off the painter's name.
 */
function splitByArtist(s) {
  const m = s.match(/^(.+?)\s+by\s+([^,;]+?)(?:,.*|\s*\(.*|\s+\d{3,4}.*)?$/i);
  if (!m) return null;
  const artist = m[2].replace(/\d{3,4}.*$/, "").replace(/[-–—].*$/, "").replace(/\s+/g, " ").trim();
  const title = m[1].replace(/[\s,;:–—-]+$/, "").trim();
  if (artist.length < 3 || artist.length > 60 || !/[A-Za-z]/.test(artist)) return null;
  return { title: title || s, artist };
}

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

  // Generic, non-attributable "artists" — rows carrying these are dropped, because
  // the catalog only lists works we can attribute to a named painter.
  const GENERIC = new Set([
    "",
    "Unknown maker",
    "Ukiyo-e master",
    "Chinese master",
    "Islamic calligrapher",
    "Persian master",
    "Anonymous",
    "Unknown",
    "Unidentified artist",
  ]);

  const add = (row) => {
    if (collected.length >= TOTAL_CAP) return false;
    const artist = (row.artist || "").trim();
    if (GENERIC.has(artist) || !/[A-Za-z]/.test(artist)) return false; // must be a named painter
    const fileKey = (row.file || row.img || "").replace(/ /g, "_").toLowerCase();
    if (!fileKey || seenFiles.has(fileKey)) return false;
    const key = `${row.title}|${artist}`.toLowerCase();
    if (seenKeys.has(key)) return false;
    if (BADWORD.test(row.file || "") || BADWORD.test(row.title)) return false;
    seenFiles.add(fileKey);
    seenKeys.add(key);
    collected.push({ ...row, artist });
    return true;
  };

  async function runWd(list, tag) {
    for (const b of list) {
      const rows = await sparql(b.where, b.cap * 3);
      let kept = 0;
      for (const r of rows) {
        if (kept >= b.cap) break;
        const raw = cleanTitle(r.title, r.file);
        const parsed = splitByArtist(raw);
        const title = parsed?.title ?? raw;
        // Prefer Wikidata's creator; fall back to a name parsed from the title.
        const artist = cleanArtist(r.artist) || parsed?.artist || "Unknown maker";
        const tone = b.tones[strHash(r.file) % b.tones.length];
        if (add({ title, artist, file: r.file, img: commonsThumb(r.file), category: b.category, tone, complexity: refineComplexity(b.complexity, `${title} ${r.file}`), style: b.style }))
          kept++;
      }
      console.log(`${tag} ${b.style.padEnd(20)} → +${kept} (total ${collected.length})`);
      await sleep(200);
    }
  }

  // Curated masterpieces lead the catalog (ids 1..N).
  for (const c of CURATED) add(c);
  console.log(`CURATED               → ${collected.length}`);

  // Optional Commons category buckets (currently none — see CC).
  for (const b of CC) {
    let kept = 0;
    for (const cat of b.cats) {
      if (kept >= b.cap) break;
      const files = await commonsCat(cat, 60);
      for (const f of files) {
        if (kept >= b.cap) break;
        const raw = cleanTitle("", f);
        const parsed = splitByArtist(raw);
        const title = parsed?.title ?? raw;
        const artist = parsed?.artist ?? b.artist;
        const tone = b.tones[strHash(f) % b.tones.length];
        if (add({ title, artist, file: f, img: commonsThumb(f), category: b.category, tone, complexity: refineComplexity(b.complexity, `${title} ${f}`), style: b.style }))
          kept++;
      }
      await sleep(200);
    }
    console.log(`CC  ${b.style.padEnd(20)} → +${kept} (total ${collected.length})`);
  }

  // Diversity (still-life / animals / floral), then the movements.
  await runWd(DIVERSITY, "DV");
  await runWd(WD, "WD");

  console.log(`\nTotal collected: ${collected.length}`);

  const rows = collected
    .map((p, i) => {
      return `  { id: ${i + 1}, title: ${JSON.stringify(p.title)}, artist: ${JSON.stringify(p.artist)}, file: "", img: ${JSON.stringify(p.img)}, category: ${JSON.stringify(p.category)}, tone: ${JSON.stringify(p.tone)}, complexity: ${JSON.stringify(p.complexity)}, style: ${JSON.stringify(p.style)} },`;
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
  | "abstract";

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

/** How many curated, site-original masterpieces lead the list. */
export const CURATED_COUNT = ${CURATED.length};
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
