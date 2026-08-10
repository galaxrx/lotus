// Curated public-domain paintings.
// Most images are from The Met Open Access (images.metmuseum.org — hotlinkable,
// legal to display/reproduce). The Abstract category is sourced from Wikimedia
// Commons (upload.wikimedia.org) because true abstract art is a 20th-century
// movement absent from The Met's public-domain holdings; every piece used here
// is itself public domain. Both hosts are allow-listed in the image CSP.
//
// Category + tone are hand-curated so the discover filters stay well-populated.
// `complexity` reflects how demanding a piece is to hand-paint and feeds pricing
// alongside size (see src/lib/config.ts).

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

export interface Painting {
  id: number;
  title: string;
  artist: string;
  file: string; // Met CRDImages file id (empty when `img` is set)
  img?: string; // full image URL, for non-Met (Wikimedia) sources
  category: Category;
  tone: Tone;
  complexity: Complexity;
}

export const metImage = (file: string) =>
  `https://images.metmuseum.org/CRDImages/ep/web-large/${file}.jpg`;

/** Resolve a painting's image URL: an explicit `img`, else its Met file id. */
export const imageOf = (p: Painting) => p.img ?? metImage(p.file);

export const PAINTINGS: Painting[] = [
  { id: 1, title: "Wheat Field with Cypresses", artist: "Vincent van Gogh", file: "DP-42549-001", category: "landscape", tone: "vivid", complexity: "involved" },
  { id: 2, title: "Irises", artist: "Vincent van Gogh", file: "DP346474", category: "floral", tone: "cool", complexity: "involved" },
  { id: 3, title: "The Card Players", artist: "Paul Cézanne", file: "DP231550", category: "figures", tone: "earthy", complexity: "involved" },
  { id: 4, title: "Circus Sideshow", artist: "Georges Seurat", file: "DP375450_cropped", category: "figures", tone: "muted", complexity: "intricate" },
  { id: 5, title: "The Monet Family in Their Garden", artist: "Édouard Manet", file: "DP-25465-001", category: "figures", tone: "vivid", complexity: "involved" },
  { id: 6, title: "The Horse Fair", artist: "Rosa Bonheur", file: "DP-23550-001", category: "animals", tone: "earthy", complexity: "intricate" },
  { id: 7, title: "The Death of Socrates", artist: "Jacques-Louis David", file: "DP-13139-001", category: "figures", tone: "warm", complexity: "intricate" },
  { id: 8, title: "The Forest in Winter at Sunset", artist: "Théodore Rousseau", file: "DP-31520-001", category: "landscape", tone: "muted", complexity: "involved" },
  { id: 9, title: "L'Arlésienne", artist: "Vincent van Gogh", file: "DT1396", category: "portrait", tone: "warm", complexity: "simple" },
  { id: 10, title: "Shoes", artist: "Vincent van Gogh", file: "DT1947", category: "still-life", tone: "earthy", complexity: "simple" },
  { id: 11, title: "Ia Orana Maria", artist: "Paul Gauguin", file: "DT1025", category: "figures", tone: "vivid", complexity: "involved" },
  { id: 12, title: "Madame Cézanne in a Red Dress", artist: "Paul Cézanne", file: "DP320128", category: "portrait", tone: "warm", complexity: "involved" },
  { id: 13, title: "Madame Charpentier and Her Children", artist: "Auguste Renoir", file: "DP-35674-001", category: "portrait", tone: "muted", complexity: "intricate" },
  { id: 14, title: "The House with the Cracked Walls", artist: "Paul Cézanne", file: "DT1943", category: "landscape", tone: "earthy", complexity: "involved" },
  { id: 15, title: "The French Comedians", artist: "Antoine Watteau", file: "DP120381", category: "figures", tone: "muted", complexity: "involved" },
  { id: 16, title: "Christ Blessing", artist: "Gerard David", file: "DP218061", category: "portrait", tone: "cool", complexity: "simple" },
  { id: 17, title: "The Harvesters", artist: "Pieter Bruegel the Elder", file: "DP119115", category: "landscape", tone: "earthy", complexity: "intricate" },
  { id: 18, title: "The Penitence of Saint Jerome", artist: "Joachim Patinir", file: "DT5549", category: "landscape", tone: "cool", complexity: "intricate" },
  { id: 19, title: "Portrait of a Man", artist: "Velázquez", file: "DP276131", category: "portrait", tone: "muted", complexity: "simple" },
  { id: 20, title: "Young Woman with a Pink", artist: "Hans Memling", file: "DP-45396-001", category: "portrait", tone: "cool", complexity: "involved" },
  { id: 21, title: "Madame Jacques-Louis Leblanc", artist: "J. A. D. Ingres", file: "DT1926", category: "portrait", tone: "muted", complexity: "involved" },
  { id: 22, title: "Don Andrés de Andrade y la Cal", artist: "Bartolomé Estebán Murillo", file: "DP-16333-001", category: "portrait", tone: "warm", complexity: "involved" },
  { id: 23, title: "Marie Emilie Coignet de Courson with a Dog", artist: "Jean-Honoré Fragonard", file: "DP-1019-01", category: "portrait", tone: "warm", complexity: "involved" },
  { id: 24, title: "Basket of Flowers", artist: "Eugène Delacroix", file: "DP-14347-001", category: "floral", tone: "vivid", complexity: "involved" },
  { id: 25, title: "Still Life with Flowers and Fruit", artist: "Henri Fantin-Latour", file: "DT1980", category: "floral", tone: "muted", complexity: "involved" },
  { id: 26, title: "A Bouquet of Flowers", artist: "Clara Peeters", file: "DP-19451-001", category: "floral", tone: "earthy", complexity: "intricate" },
  { id: 27, title: "Still Life with Flowers and Prickly Pears", artist: "Auguste Renoir", file: "DP257756", category: "floral", tone: "vivid", complexity: "involved" },
  { id: 28, title: "Still Life with a Skull and a Writing Quill", artist: "Pieter Claesz", file: "DP145929", category: "still-life", tone: "earthy", complexity: "simple" },
  { id: 29, title: "Still Life with Oysters and Glassware", artist: "Willem Claesz Heda", file: "DP120415", category: "still-life", tone: "muted", complexity: "intricate" },
  { id: 30, title: "Still Life with Apples and a Pitcher", artist: "Camille Pissarro", file: "DP-21958-001", category: "still-life", tone: "earthy", complexity: "simple" },
  { id: 31, title: "Still Life with Teapot and Fruit", artist: "Paul Gauguin", file: "DT1027", category: "still-life", tone: "warm", complexity: "simple" },
  { id: 32, title: "Still Life", artist: "Georg Flegel", file: "DP-25893-001", category: "still-life", tone: "earthy", complexity: "intricate" },
  { id: 33, title: "Dog Guarding Dead Game", artist: "Jean-Baptiste Oudry", file: "DP356140", category: "animals", tone: "earthy", complexity: "involved" },
  { id: 34, title: "Equestrian Portrait with Tutor and Coachman", artist: "Aelbert Cuyp", file: "DP146442", category: "animals", tone: "warm", complexity: "intricate" },
  { id: 35, title: "A Maid Asleep", artist: "Johannes Vermeer", file: "DP355525", category: "figures", tone: "warm", complexity: "involved" },
  { id: 36, title: "Two Children Teasing a Cat", artist: "Annibale Carracci", file: "DP243404", category: "figures", tone: "muted", complexity: "simple" },

  // ------------------------------- Abstract -------------------------------
  // Public-domain 20th-century abstraction, sourced from Wikimedia Commons.
  { id: 37, title: "Composition VII", artist: "Wassily Kandinsky", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg/1280px-Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg", category: "abstract", tone: "vivid", complexity: "intricate" },
  { id: 38, title: "Squares with Concentric Circles", artist: "Wassily Kandinsky", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/9/98/Vassily_Kandinsky%2C_1913_-_Color_Study%2C_Squares_with_Concentric_Circles.jpg", category: "abstract", tone: "vivid", complexity: "simple" },
  { id: 39, title: "Suprematist Composition", artist: "Kazimir Malevich", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Suprematist_Composition_-_Kazimir_Malevich.jpg/1280px-Suprematist_Composition_-_Kazimir_Malevich.jpg", category: "abstract", tone: "muted", complexity: "simple" },
  { id: 40, title: "The Ten Largest, No. 4, Youth", artist: "Hilma af Klint", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg/1280px-Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg", category: "abstract", tone: "cool", complexity: "involved" },
  { id: 41, title: "Simultaneous Contrasts: Sun and Moon", artist: "Robert Delaunay", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/d/df/Robert_Delaunay_-_Simultaneous_Contrasts-Sun_and_Moon_-_1912.jpg", category: "abstract", tone: "vivid", complexity: "involved" },
  { id: 42, title: "Castle and Sun", artist: "Paul Klee", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Burg_und_Sonne_-_Klee.jpg/1280px-Burg_und_Sonne_-_Klee.jpg", category: "abstract", tone: "warm", complexity: "simple" },
  { id: 43, title: "Composition II in Red, Blue, and Yellow", artist: "Piet Mondrian", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/1280px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg", category: "abstract", tone: "vivid", complexity: "simple" },
  { id: 44, title: "The Yellow Cow", artist: "Franz Marc", file: "", img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Franz_Marc-The_Yellow_Cow-1911.jpg", category: "abstract", tone: "warm", complexity: "involved" },
];

export const collectionItems = PAINTINGS.map((p) => ({
  id: p.id,
  image: imageOf(p),
  title: `${p.title} — ${p.artist}`,
}));
