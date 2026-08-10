// Curated public-domain paintings from The Met Open Access.
// images.metmuseum.org URLs are hotlinkable and legal to display/reproduce.
// In production these are ingested into the catalog with extracted colors; here
// they're a hand-curated starter set shared by the landing, gallery, and hero.

export type Category =
  | "landscape"
  | "portrait"
  | "floral"
  | "still-life"
  | "figures"
  | "animals";

export type Tone = "warm" | "cool" | "earthy" | "vivid" | "muted";

export interface Painting {
  id: number;
  title: string;
  artist: string;
  file: string; // Met CRDImages file id
  category: Category;
  tone: Tone;
}

export const metImage = (file: string) =>
  `https://images.metmuseum.org/CRDImages/ep/web-large/${file}.jpg`;

export const PAINTINGS: Painting[] = [
  { id: 1, title: "Wheat Field with Cypresses", artist: "Vincent van Gogh", file: "DP-42549-001", category: "landscape", tone: "vivid" },
  { id: 2, title: "Irises", artist: "Vincent van Gogh", file: "DP346474", category: "floral", tone: "cool" },
  { id: 3, title: "The Card Players", artist: "Paul Cézanne", file: "DP231550", category: "figures", tone: "earthy" },
  { id: 4, title: "Circus Sideshow", artist: "Georges Seurat", file: "DP375450_cropped", category: "figures", tone: "muted" },
  { id: 5, title: "The Monet Family in Their Garden", artist: "Édouard Manet", file: "DP-25465-001", category: "figures", tone: "vivid" },
  { id: 6, title: "The Horse Fair", artist: "Rosa Bonheur", file: "DP-23550-001", category: "animals", tone: "earthy" },
  { id: 7, title: "The Death of Socrates", artist: "Jacques-Louis David", file: "DP-13139-001", category: "figures", tone: "warm" },
  { id: 8, title: "The Forest in Winter at Sunset", artist: "Théodore Rousseau", file: "DP-31520-001", category: "landscape", tone: "muted" },
  { id: 9, title: "L'Arlésienne", artist: "Vincent van Gogh", file: "DT1396", category: "portrait", tone: "warm" },
  { id: 10, title: "Shoes", artist: "Vincent van Gogh", file: "DT1947", category: "still-life", tone: "earthy" },
  { id: 11, title: "Ia Orana Maria", artist: "Paul Gauguin", file: "DT1025", category: "figures", tone: "vivid" },
  { id: 12, title: "Madame Cézanne in a Red Dress", artist: "Paul Cézanne", file: "DP320128", category: "portrait", tone: "warm" },
  { id: 13, title: "Madame Charpentier and Her Children", artist: "Auguste Renoir", file: "DP-35674-001", category: "portrait", tone: "muted" },
  { id: 14, title: "The House with the Cracked Walls", artist: "Paul Cézanne", file: "DT1943", category: "landscape", tone: "earthy" },
  { id: 15, title: "The French Comedians", artist: "Antoine Watteau", file: "DP120381", category: "figures", tone: "muted" },
  { id: 16, title: "Christ Blessing", artist: "Gerard David", file: "DP218061", category: "portrait", tone: "cool" },
];

export const collectionItems = PAINTINGS.map((p) => ({
  id: p.id,
  image: metImage(p.file),
  title: `${p.title} — ${p.artist}`,
}));
