// Curated public-domain paintings from The Met Open Access.
// images.metmuseum.org URLs are hotlinkable and legal to display/reproduce.
// Category + tone are hand-curated so the discover filters are well-populated
// across every theme and color tone.

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
  { id: 17, title: "The Harvesters", artist: "Pieter Bruegel the Elder", file: "DP119115", category: "landscape", tone: "earthy" },
  { id: 18, title: "The Penitence of Saint Jerome", artist: "Joachim Patinir", file: "DT5549", category: "landscape", tone: "cool" },
  { id: 19, title: "Portrait of a Man", artist: "Velázquez", file: "DP276131", category: "portrait", tone: "muted" },
  { id: 20, title: "Young Woman with a Pink", artist: "Hans Memling", file: "DP-45396-001", category: "portrait", tone: "cool" },
  { id: 21, title: "Madame Jacques-Louis Leblanc", artist: "J. A. D. Ingres", file: "DT1926", category: "portrait", tone: "muted" },
  { id: 22, title: "Don Andrés de Andrade y la Cal", artist: "Bartolomé Estebán Murillo", file: "DP-16333-001", category: "portrait", tone: "warm" },
  { id: 23, title: "Marie Emilie Coignet de Courson with a Dog", artist: "Jean-Honoré Fragonard", file: "DP-1019-01", category: "portrait", tone: "warm" },
  { id: 24, title: "Basket of Flowers", artist: "Eugène Delacroix", file: "DP-14347-001", category: "floral", tone: "vivid" },
  { id: 25, title: "Still Life with Flowers and Fruit", artist: "Henri Fantin-Latour", file: "DT1980", category: "floral", tone: "muted" },
  { id: 26, title: "A Bouquet of Flowers", artist: "Clara Peeters", file: "DP-19451-001", category: "floral", tone: "earthy" },
  { id: 27, title: "Still Life with Flowers and Prickly Pears", artist: "Auguste Renoir", file: "DP257756", category: "floral", tone: "vivid" },
  { id: 28, title: "Still Life with a Skull and a Writing Quill", artist: "Pieter Claesz", file: "DP145929", category: "still-life", tone: "earthy" },
  { id: 29, title: "Still Life with Oysters and Glassware", artist: "Willem Claesz Heda", file: "DP120415", category: "still-life", tone: "muted" },
  { id: 30, title: "Still Life with Apples and a Pitcher", artist: "Camille Pissarro", file: "DP-21958-001", category: "still-life", tone: "earthy" },
  { id: 31, title: "Still Life with Teapot and Fruit", artist: "Paul Gauguin", file: "DT1027", category: "still-life", tone: "warm" },
  { id: 32, title: "Still Life", artist: "Georg Flegel", file: "DP-25893-001", category: "still-life", tone: "earthy" },
  { id: 33, title: "Dog Guarding Dead Game", artist: "Jean-Baptiste Oudry", file: "DP356140", category: "animals", tone: "earthy" },
  { id: 34, title: "Equestrian Portrait with Tutor and Coachman", artist: "Aelbert Cuyp", file: "DP146442", category: "animals", tone: "warm" },
  { id: 35, title: "A Maid Asleep", artist: "Johannes Vermeer", file: "DP355525", category: "figures", tone: "warm" },
  { id: 36, title: "Two Children Teasing a Cat", artist: "Annibale Carracci", file: "DP243404", category: "figures", tone: "muted" },
];

export const collectionItems = PAINTINGS.map((p) => ({
  id: p.id,
  image: metImage(p.file),
  title: `${p.title} — ${p.artist}`,
}));
