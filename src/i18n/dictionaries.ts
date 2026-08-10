import type { Locale } from "./config";

/**
 * UI copy for Niloosa — the hand-painted wall-art commissioning app — in English
 * and Persian. `en` defines the canonical shape; `fa` must match it.
 */
const en = {
  meta: {
    title: "Niloosa — Hand-painted masterpieces for your wall",
    description:
      "Choose a real painting you love, preview it on your wall in AR, and have a painter hand-paint it on canvas — real texture, real signature.",
  },
  nav: {
    how: "How it works",
    gallery: "Gallery",
    sizes: "Sizes & pricing",
    artist: "The artist",
    styles: "Styles",
    browse: "Find your painting",
    signIn: "Sign in",
    menu: "Menu",
  },
  hero: {
    eyebrow: "Hand-painted · Public-domain masterworks",
    titleLead: "A real painting for your wall,",
    titleAccent: "made by hand.",
    subtitle:
      "Pick a masterpiece by color, style, and budget. See it on your wall in AR. A painter reproduces it on canvas — real brushwork, real texture, signed by hand.",
    ctaPrimary: "Find your painting",
    ctaSecondary: "See how it works",
    note: "No AI-generated art · Museum public-domain sources · Preview before you commit",
  },
  marquee: [
    "Public-domain masterworks",
    "Hand-painted on canvas",
    "Real texture & signature",
    "Preview on your wall in AR",
    "Delivered to your door",
  ],
  how: {
    eyebrow: "How it works",
    title: "From a painting you love to a canvas on your wall.",
    steps: [
      {
        title: "Choose your taste",
        body: "Tell us a theme, a color tone, and a budget. Niloosa surfaces real paintings that fit — no endless scrolling.",
      },
      {
        title: "See it on your wall",
        body: "Point your phone at the wall and preview the framed canvas at real size before you decide.",
      },
      {
        title: "Send the request",
        body: "Pick a size and frame and confirm. Your request goes straight to the painter on Telegram.",
      },
      {
        title: "Painted & delivered",
        body: "The painter reproduces it on canvas with real texture, signs it, and ships it to your door.",
      },
    ],
  },
  featured: {
    eyebrow: "The collection",
    title: "Masterpieces, ready for your walls.",
    subtitle:
      "A curated selection from the world's great museums — all public domain, all reproducible.",
    cta: "Enter the gallery",
    viewAll: "Browse all paintings",
  },
  wall: {
    eyebrow: "Preview in AR",
    title: "See it on your wall before you commit.",
    body: "Guesswork is the enemy of good art on a wall. Open your camera, place the framed painting at true scale, and move it around until it's right.",
    points: [
      "True-to-size framed preview",
      "Works in your browser — no app to install",
      "Snapshot it to compare rooms",
    ],
    note: "Point · place · picture it.",
  },
  sizes: {
    eyebrow: "Sizes & pricing",
    title: "Simple sizes. Honest pricing.",
    subtitle:
      "The artwork is public domain — you pay for the painter's hand and the canvas. Pick a size and frame; tune the rest with the painter.",
    from: "from",
    perPiece: "/ piece",
    frameLabel: "Frames",
    frames: ["Rolled canvas", "Natural wood", "Black", "White"],
    tiers: [
      { name: "Small", dims: "30 × 40 cm", price: "$120" },
      { name: "Medium", dims: "50 × 70 cm", price: "$200" },
      { name: "Large", dims: "70 × 100 cm", price: "$320" },
      { name: "Grand", dims: "90 × 120 cm", price: "$480" },
    ],
    disclaimer: "Indicative “from” prices — the final figure depends on the size, the frame, and how detailed the artwork is, and is confirmed with the painter before any payment.",
  },
  values: {
    eyebrow: "Why Niloosa",
    title: "Real art, made the real way.",
    items: [
      {
        title: "Not AI — real paintings",
        body: "Every piece is a genuine artwork from a museum's public-domain collection, reproduced by a human hand.",
      },
      {
        title: "Real texture & signature",
        body: "Oil on canvas with visible brushwork and the painter's signature — a piece, not a print.",
      },
      {
        title: "Preview before you pay",
        body: "See it on your wall and confirm the size and frame first. No surprises when it arrives.",
      },
      {
        title: "Legally yours",
        body: "We only use public-domain masterworks, so your reproduction is fully above board.",
      },
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Good to know.",
    items: [
      {
        q: "Are these prints or real paintings?",
        a: "Real paintings. A painter reproduces your chosen artwork by hand on canvas, with genuine texture and a signature.",
      },
      {
        q: "Where do the paintings come from?",
        a: "Public-domain collections from major museums (like The Met). That's what makes hand reproduction legal and worry-free.",
      },
      {
        q: "How do I order?",
        a: "Pick a painting, size, and frame, then send the request. It reaches the painter on Telegram, who confirms details and price with you directly.",
      },
      {
        q: "How does the wall preview work?",
        a: "Your phone camera places the framed canvas on your wall at real size — right in the browser, nothing to install.",
      },
      {
        q: "How long does it take?",
        a: "Hand-painting takes time. The painter gives you a timeline when confirming your order — typically a few weeks.",
      },
    ],
  },
  cta: {
    title: "Find the painting your wall is missing.",
    subtitle: "Browse the masterworks, preview one at home, and let a painter bring it to life.",
    button: "Find your painting",
    note: "It only takes a minute to start.",
  },
  footer: {
    tagline: "Hand-painted masterpieces for your wall.",
    product: "Explore",
    company: "Niloosa",
    legal: "Legal",
    links: {
      how: "How it works",
      gallery: "Gallery",
      styles: "Styles guide",
      sizes: "Sizes & pricing",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
    },
    rights: "All rights reserved.",
    sources: "Artworks courtesy of open-access museum collections (public domain).",
  },
  auth: {
    signInTitle: "Welcome back",
    signInSubtitle: "Sign in to track your commissions.",
    signUpTitle: "Create an account",
    signUpSubtitle: "Save favorites and track your orders.",
    email: "Email",
    password: "Password",
    name: "Full name",
    signIn: "Sign in",
    signUp: "Create account",
    haveAccount: "Already have an account?",
    noAccount: "New to Niloosa?",
    demoNote: "This is a local demo build. Connect Supabase to enable real sign-in.",
  },
  dashboard: {
    title: "Your studio",
    welcome: "Your commissions",
    subtitle: "This is a local scaffold. Connect Supabase and Prisma to see live data.",
    credits: "Saved paintings",
    workspace: "Orders",
    generate: "Find a painting",
    library: "Order history",
    settings: "Settings",
    signOut: "Sign out",
    empty: "No orders yet. Your commissions will appear here.",
  },
  discover: {
    title: "Find your painting",
    subtitle: "Pick a mood, a palette, and a budget — we'll surface masterpieces that fit.",
    theme: "Theme",
    color: "Color tone",
    budget: "Budget",
    any: "Any",
    results: "paintings",
    none: "No paintings match yet — try loosening a filter.",
    clear: "Clear filters",
    categories: {
      landscape: "Landscape",
      portrait: "Portrait",
      floral: "Floral",
      "still-life": "Still life",
      figures: "Figures",
      animals: "Animals",
      abstract: "Abstract",
    },
    tones: {
      warm: "Warm",
      cool: "Cool",
      earthy: "Earthy",
      vivid: "Vivid",
      muted: "Muted",
    },
    budgets: ["Under $200", "$200 – 400", "$400+"],
  },
  detail: {
    by: "by",
    size: "Size",
    frame: "Frame",
    complexity: "Complexity",
    complexities: { simple: "Simple", involved: "Involved", intricate: "Intricate" },
    total: "Total",
    preview: "Preview on my wall",
    request: "Request this painting",
    note: "Public-domain artwork · hand-painted to order",
    back: "Back to gallery",
  },
  gallery: {
    title: "The collection",
    subtitle: "Every masterpiece we can hand-paint for your wall. Tap any piece to view it full-size.",
    view: "View full size",
    close: "Close",
    prev: "Previous",
    next: "Next",
    request: "Request this painting",
  },
  styles: {
    metaTitle: "Painting Styles Guide — History, Masters & How to Style Them at Home",
    metaDescription:
      "A guide to the great painting styles we hand-paint on canvas — Impressionism, Post-Impressionism, Baroque, Dutch still life, Renaissance portraiture, Romantic landscape and Abstract art — with their history, the painters who defined them, and the home interiors each one suits best.",
    eyebrow: "Guide",
    title: "A guide to painting styles",
    intro:
      "Not sure which style belongs on your wall? Here's a plain-English tour of the movements we hand-paint — where each one came from, the painters who defined it, and the kind of home it feels most at ease in.",
    historyLabel: "History",
    paintersLabel: "Defining painters",
    homeLabel: "Suits a home that's",
    browse: "See these in the gallery",
    cta: "Find your painting",
    items: [
      {
        name: "Impressionism",
        era: "1860s–1880s · France",
        history:
          "Born when a handful of Paris painters left the studio for the open air, chasing daylight and fleeting moments with quick, broken strokes. Rejected by the official Salon, they staged their own exhibitions — and a critic's jab at Monet's “Impression, Sunrise” gave the movement its name.",
        painters: "Claude Monet, Pierre-Auguste Renoir, Edgar Degas, Camille Pissarro",
        home: "Light, airy and unfussy — Scandinavian, modern-coastal and soft-minimalist rooms where a sunny canvas can breathe.",
      },
      {
        name: "Post-Impressionism",
        era: "1880s–1900s · France",
        history:
          "The generation after Impressionism kept its bright palette but pushed past pure observation — into bold colour, thick paint and personal feeling. Each artist went their own way, from Van Gogh's swirling energy to Cézanne's building blocks of form that opened the door to modern art.",
        painters: "Vincent van Gogh, Paul Cézanne, Paul Gauguin, Georges Seurat",
        home: "Warm and characterful — mid-century modern, eclectic and bohemian spaces that welcome strong colour.",
      },
      {
        name: "Baroque & the Old Masters",
        era: "17th century · Europe",
        history:
          "A theatrical age of deep shadow and dramatic light (chiaroscuro), rich fabrics and charged emotion. Painters worked for courts and churches, staging scenes that reach out and grip the viewer.",
        painters: "Caravaggio, Rembrandt van Rijn, Diego Velázquez, Johannes Vermeer",
        home: "Formal and timeless — traditional studies, dark-academia libraries and dramatic dining rooms.",
      },
      {
        name: "Dutch Golden Age Still Life",
        era: "17th century · The Netherlands",
        history:
          "In the prosperous Dutch Republic, painters turned everyday things — glassware, silver, fruit, a guttering candle — into quiet meditations on abundance and mortality, rendered with almost unbelievable precision.",
        painters: "Willem Claesz Heda, Pieter Claesz, Clara Peeters, Willem Kalf",
        home: "Classic and intimate — refined dining rooms, moody kitchens and panelled studies.",
      },
      {
        name: "Renaissance & Classical Portraiture",
        era: "15th–19th century · Europe",
        history:
          "From the Renaissance onward, portraiture became the art of presence — balanced composition, careful modelling of light, and a sitter who seems to meet your eye across centuries. The neoclassical masters later refined it to a cool, linear perfection.",
        painters: "Hans Memling, Raphael, J. A. D. Ingres, Élisabeth Vigée Le Brun",
        home: "Elegant and considered — traditional, transitional and formal entryways or hallways.",
      },
      {
        name: "Romantic Landscape",
        era: "Late 18th–19th century · Europe & America",
        history:
          "Romantic painters made nature the main character — vast skies, changing weather, and light doing something extraordinary. Landscape shifted from a backdrop to the emotional heart of the picture.",
        painters: "J. M. W. Turner, John Constable, Théodore Rousseau, the Hudson River School",
        home: "Grounding and natural — rustic, farmhouse, biophilic and calm bedrooms.",
      },
      {
        name: "Abstract Art & Modernism",
        era: "Early 20th century · Europe",
        history:
          "In the years around 1910, artists let go of depicting the world and let colour, shape and line speak for themselves — from Kandinsky's musical improvisations to Mondrian's grids and Malevich's pure geometry. It remains the language of modern design.",
        painters: "Wassily Kandinsky, Piet Mondrian, Kazimir Malevich, Paul Klee",
        home: "Clean and contemporary — minimalist, Bauhaus, mid-century and monochrome rooms that want one bold focal point.",
      },
    ],
  },
  order: {
    title: "Request your painting",
    subtitle: "Send the details to the painter. They confirm timeline and final price with you.",
    summary: "Your commission",
    name: "Your name",
    contact: "Email or phone",
    contactHint: "So the painter can reach you.",
    address: "Delivery address",
    note: "Note to the painter (optional)",
    submit: "Send request",
    submitting: "Sending…",
    cancel: "Cancel",
    successTitle: "Request sent",
    successBody: "Your commission request has reached the painter. They'll be in touch to confirm details, timeline, and payment.",
    ref: "Reference",
    backHome: "Back to home",
    browse: "Browse more paintings",
    error: "Something went wrong. Please try again.",
    demoNote: "Demo mode: the request isn't persisted and Telegram delivery is stubbed until configured.",
  },
  ar: {
    title: "See it on your wall",
    start: "Start camera",
    upload: "Use a wall photo",
    snapshot: "Save snapshot",
    close: "Close",
    hint: "Drag to move · use the slider to resize.",
    size: "Size on wall",
    unsupported: "Camera unavailable — upload a photo of your wall instead.",
  },
  legal: {
    updated: "Last updated: August 2026",
    back: "Back to home",
    privacy: {
      title: "Privacy Policy",
      intro: "This policy explains what Niloosa collects when you request a commission and how it is used.",
      sections: [
        { h: "What we collect", b: "When you request a painting we collect the details you provide: your name, contact (email or phone), delivery address, and any note. No account is required and we do not collect payment details on this site." },
        { h: "How we use it", b: "We use your details solely to fulfil your commission — the request is sent to the painter, who contacts you to confirm the artwork, timeline, and price. We do not sell your data." },
        { h: "Sharing", b: "Your request is shared with the painter responsible for your order (delivered via Telegram) and, where enabled, our hosting and database providers strictly to operate the service." },
        { h: "Artworks", b: "Paintings shown are sourced from public-domain museum collections and reproduced lawfully." },
        { h: "Your choices", b: "You can ask us to access or delete your request data at any time using the contact details on our contact page." },
      ],
    },
    terms: {
      title: "Terms of Service",
      intro: "By using Niloosa and requesting a commission, you agree to these terms.",
      sections: [
        { h: "The service", b: "Niloosa lets you request a hand-painted canvas reproduction of a public-domain artwork. Submitting a request is not a binding order — the painter confirms scope, timeline, and final price with you before any work or payment." },
        { h: "Pricing & payment", b: "Prices shown are indicative. Final pricing and payment are arranged directly with the painter. No payment is collected on this website." },
        { h: "Reproductions", b: "All artworks offered are in the public domain. Each piece is an original hand-painted reproduction carrying the painter's signature — not an exact forgery." },
        { h: "Delivery", b: "Timelines are provided by the painter per order. Hand-painting takes time; dates are estimates, not guarantees." },
        { h: "Liability", b: "Niloosa connects you with a painter and is provided “as is”. To the extent permitted by law, we are not liable for indirect or incidental damages." },
      ],
    },
    contact: {
      title: "Contact",
      intro: "Questions about a commission or this site? We're happy to help.",
      emailLabel: "Email",
      email: "hello@niloosa.example",
      note: "For order questions, include your reference code (NIL-XXXXXX).",
    },
  },
  common: {
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    by: "by",
  },
  artist: {
    eyebrow: "The artist",
    name: "Niloofar Ensafian",
    role: "Painter · Founder of Niloosa",
    lead: "Every Niloosa canvas is touched by the same hand.",
    intro:
      "Niloofar Ensafian is the painter behind Niloosa. She trained her eye on the great masters and her hand on the slow discipline of oil and canvas — and made it her craft to bring those paintings, and her own, onto the walls of real homes.",
    statementTitle: "In her words",
    statement:
      "I don't print pictures — I paint them. A reproduction should carry the same weight as the original: the ridge of a brushstroke, the warmth of layered colour, the small imperfections that tell you a human stood in front of this canvas for days. That's the piece I want to send to your wall.",
    quote: "A wall deserves a painting that was made, not manufactured.",
    ctaPrimary: "Commission a painting",
    ctaSecondary: "Browse the gallery",
    highlights: [
      { value: "Oil & acrylic", label: "on gallery-grade canvas" },
      { value: "Hand-signed", label: "every single piece" },
      { value: "Made to order", label: "painted for your wall" },
    ],
    stylesTitle: "Styles she paints",
    stylesSubtitle:
      "From loose impressionist light to the stillness of the old masters — choose the language your wall should speak.",
    styles: [
      {
        name: "Impressionism & Post-Impressionism",
        body: "Loose, luminous brushwork and living colour — Van Gogh, Monet, and Cézanne returned to canvas with all their movement intact.",
      },
      {
        name: "Classical Portraiture",
        body: "Skin, fabric, and gaze rendered with old-world patience — a face built layer over layer until it holds the room.",
      },
      {
        name: "Dutch Still Life",
        body: "Glass, silver, and fruit lit against deep shadow — the quiet drama of the Golden Age, down to the last reflection.",
      },
      {
        name: "Floral & Botanical",
        body: "Her signature register: blooms and foliage in warm, modern palettes that feel at home on a contemporary wall.",
      },
      {
        name: "Atmospheric Landscape",
        body: "Forests, fields, and failing light — wide, moody scenes that give a room depth and the eye a place to rest.",
      },
      {
        name: "Old Master Figures",
        body: "Composed, narrative scenes in the tradition of Vermeer and David — balance, gesture, and light held in perfect check.",
      },
    ],
    commissionTitle: "Have something specific in mind?",
    commissionBody:
      "Bring a painting you love — or an idea of your own — and Niloofar will reproduce or reinterpret it by hand, in the style and size your space calls for.",
    commissionButton: "Start a commission",
  },
};

export type Dictionary = typeof en;

const fa: Dictionary = {
  meta: {
    title: "نیلوسا | تابلوهای دست‌ساز برای دیوار خانه‌ی شما",
    description:
      "تابلویی را که می‌پسندید انتخاب کنید، پیش از سفارش آن را روی دیوار خانه‌ی خود ببینید و بسپارید نقاش با دست روی بوم بازآفرینی‌اش کند؛ با بافت و امضای واقعی.",
  },
  nav: {
    how: "چطور کار می‌کند",
    gallery: "گالری",
    sizes: "اندازه و قیمت",
    artist: "نقاش",
    styles: "سبک‌ها",
    browse: "پیدا کردن تابلو",
    signIn: "ورود",
    menu: "منو",
  },
  hero: {
    eyebrow: "دست‌ساز · از شاهکارهای ماندگار جهان",
    titleLead: "یک تابلوی اصیل برای دیوار شما،",
    titleAccent: "کشیده با دست.",
    subtitle:
      "بر پایه‌ی رنگ، حال‌وهوا و بودجه‌تان یک شاهکار انتخاب کنید، آن را روی دیوار خانه ببینید و بسپارید نقاش با قلم‌مو روی بوم بازآفرینی‌اش کند؛ اثری با بافت و امضای واقعی، نه یک چاپ ساده.",
    ctaPrimary: "تابلوی خود را پیدا کنید",
    ctaSecondary: "ببینید چطور کار می‌کند",
    note: "بدون هنر هوش مصنوعی · برگرفته از آثار آزاد موزه‌ای · پیش از سفارش، پیش‌نمایش بگیرید",
  },
  marquee: [
    "شاهکارهای ماندگار جهان",
    "کشیده با دست روی بوم",
    "بافت و امضای واقعی",
    "پیش‌نمایش روی دیوار خانه",
    "تحویل درِ خانه",
  ],
  how: {
    eyebrow: "چطور کار می‌کند",
    title: "از تابلویی که دل‌تان را می‌برد تا بومی روی دیوار خانه.",
    steps: [
      {
        title: "سلیقه‌تان را بگویید",
        body: "کافی است حال‌وهوا، رنگ و بودجه‌ی دلخواه‌تان را بگویید؛ نیلوسا تابلوهای مناسب را پیش رویتان می‌گذارد، بی‌آنکه ساعت‌ها جست‌وجو کنید.",
      },
      {
        title: "روی دیوار خانه ببینید",
        body: "گوشی را روبه‌روی دیوار بگیرید و تابلوی قاب‌شده را در اندازه‌ی واقعی، پیش از هر تصمیمی، تماشا کنید.",
      },
      {
        title: "سفارش را بفرستید",
        body: "اندازه و قاب را انتخاب و تأیید کنید؛ سفارش‌تان مستقیم و بی‌واسطه در تلگرام به دست نقاش می‌رسد.",
      },
      {
        title: "نقاشی و تحویل",
        body: "نقاش تابلو را با بافت واقعی روی بوم می‌کشد، امضایش می‌کند و به درِ خانه‌تان می‌رساند.",
      },
    ],
  },
  featured: {
    eyebrow: "مجموعه",
    title: "شاهکارها، آماده‌ی دیوار شما.",
    subtitle:
      "گزیده‌ای دست‌چین از بزرگ‌ترین موزه‌های جهان؛ همه از آثار آزاد و قابل بازآفرینی.",
    cta: "ورود به گالری",
    viewAll: "دیدن همه‌ی تابلوها",
  },
  wall: {
    eyebrow: "پیش‌نمایش روی دیوار",
    title: "پیش از سفارش، روی دیوار خانه ببینیدش.",
    body: "برای پیدا کردن جای درست یک تابلو، حدس‌وگمان کافی نیست. دوربین را باز کنید، تابلوی قاب‌شده را در اندازه‌ی واقعی روی دیوار بگذارید و آن‌قدر جابه‌جایش کنید تا درست سرِ جای خودش بنشیند.",
    points: [
      "نمایش قاب‌شده در اندازه‌ی واقعی",
      "در مرورگر اجرا می‌شود؛ بی‌نیاز از نصب برنامه",
      "از نتیجه عکس بگیرید و اتاق‌ها را با هم بسنجید",
    ],
    note: "بگیرید، بگذارید، تصور کنید.",
  },
  sizes: {
    eyebrow: "اندازه و قیمت",
    title: "اندازه‌های ساده، قیمت شفاف.",
    subtitle:
      "خودِ اثر از آثار آزاد است؛ چیزی که می‌پردازید بهای دست نقاش و بوم است. اندازه و قاب را انتخاب کنید و باقی جزئیات را با نقاش هماهنگ کنید.",
    from: "از",
    perPiece: "/ هر تابلو",
    frameLabel: "قاب‌ها",
    frames: ["بوم بدون قاب", "چوب طبیعی", "مشکی", "سفید"],
    tiers: [
      { name: "کوچک", dims: "۳۰ × ۴۰ سانتی‌متر", price: "۳٬۰۰۰٬۰۰۰ تومان" },
      { name: "متوسط", dims: "۵۰ × ۷۰ سانتی‌متر", price: "۶٬۰۰۰٬۰۰۰ تومان" },
      { name: "بزرگ", dims: "۷۰ × ۱۰۰ سانتی‌متر", price: "۹٬۰۰۰٬۰۰۰ تومان" },
      { name: "خیلی بزرگ", dims: "۹۰ × ۱۲۰ سانتی‌متر", price: "۱۳٬۰۰۰٬۰۰۰ تومان" },
    ],
    disclaimer: "این‌ها قیمت‌های پایه («از») هستند؛ رقم نهایی به اندازه، قاب و میزان جزئیاتِ اثر بستگی دارد و پیش از هر پرداختی با نقاش تأیید می‌شود.",
  },
  values: {
    eyebrow: "چرا نیلوسا",
    title: "هنر واقعی، به شیوه‌ی واقعی.",
    items: [
      {
        title: "نه هوش مصنوعی؛ نقاشی واقعی",
        body: "هر تابلو یک اثر اصیل از مجموعه‌ی آثار آزاد موزه‌هاست که با دست انسان دوباره جان می‌گیرد.",
      },
      {
        title: "بافت و امضای واقعی",
        body: "رنگ‌روغن روی بوم با ردِ آشکار قلم‌مو و امضای نقاش؛ یک اثر هنری، نه یک چاپ.",
      },
      {
        title: "اول ببینید، بعد بپردازید",
        body: "تابلو را روی دیوار خانه ببینید و اندازه و قاب را تأیید کنید؛ هنگام تحویل هیچ غافلگیری‌ای در کار نیست.",
      },
      {
        title: "به‌طور قانونی از آنِ شما",
        body: "ما فقط از شاهکارهای آزاد استفاده می‌کنیم، پس بازآفرینی تابلوی شما کاملاً قانونی است.",
      },
    ],
  },
  faq: {
    eyebrow: "پرسش‌های شما",
    title: "خوب است بدانید.",
    items: [
      {
        q: "این‌ها چاپ‌اند یا نقاشی واقعی؟",
        a: "نقاشی واقعی. نقاش تابلوی انتخابی شما را با دست و روی بوم بازآفرینی می‌کند؛ با بافت اصیل و امضای خودش.",
      },
      {
        q: "تابلوها از کجا می‌آیند؟",
        a: "از مجموعه‌های آزاد موزه‌های بزرگ جهان (مانند موزه‌ی مِت). همین آزاد بودن است که بازآفرینی دستی را قانونی و بی‌دردسر می‌کند.",
      },
      {
        q: "چطور سفارش بدهم؟",
        a: "یک تابلو، اندازه و قاب انتخاب کنید و سفارش را بفرستید. سفارش در تلگرام به نقاش می‌رسد و او جزئیات و قیمت را مستقیم با شما نهایی می‌کند.",
      },
      {
        q: "پیش‌نمایش روی دیوار چطور کار می‌کند؟",
        a: "دوربین گوشی تابلوی قاب‌شده را در اندازه‌ی واقعی روی دیوار نشان می‌دهد؛ همه‌چیز داخل مرورگر، بدون نصب هیچ برنامه‌ای.",
      },
      {
        q: "چقدر طول می‌کشد؟",
        a: "نقاشی دستی زمان می‌برد. نقاش هنگام نهایی‌کردن سفارش زمان تحویل را به شما می‌گوید؛ معمولاً چند هفته.",
      },
    ],
  },
  cta: {
    title: "تابلویی را که جای دیوارتان خالی است، پیدا کنید.",
    subtitle: "شاهکارها را ببینید، یکی را در خانه پیش‌نمایش بگیرید و بگذارید نقاش جانش ببخشد.",
    button: "تابلوی خود را پیدا کنید",
    note: "شروعش کمتر از یک دقیقه وقت می‌برد.",
  },
  footer: {
    tagline: "تابلوهای دست‌ساز برای دیوار خانه‌ی شما.",
    product: "کاوش",
    company: "نیلوسا",
    legal: "قوانین",
    links: {
      how: "چطور کار می‌کند",
      gallery: "گالری",
      styles: "راهنمای سبک‌ها",
      sizes: "اندازه و قیمت",
      about: "درباره‌ی ما",
      contact: "تماس",
      privacy: "حریم خصوصی",
      terms: "قوانین و شرایط",
    },
    rights: "همه‌ی حقوق محفوظ است.",
    sources: "تصاویر آثار با سپاس از مجموعه‌های موزه‌ای با دسترسی آزاد (آثار آزاد).",
  },
  auth: {
    signInTitle: "خوش آمدید",
    signInSubtitle: "برای پیگیری سفارش‌هایتان وارد شوید.",
    signUpTitle: "ساخت حساب کاربری",
    signUpSubtitle: "تابلوهای موردعلاقه را ذخیره و سفارش‌ها را دنبال کنید.",
    email: "ایمیل",
    password: "رمز عبور",
    name: "نام و نام خانوادگی",
    signIn: "ورود",
    signUp: "ساخت حساب",
    haveAccount: "قبلاً حساب ساخته‌اید؟",
    noAccount: "تازه با نیلوسا آشنا شده‌اید؟",
    demoNote: "این یک نسخه‌ی نمایشی محلی است. برای فعال شدن ورود واقعی، Supabase را متصل کنید.",
  },
  dashboard: {
    title: "کارگاه شما",
    welcome: "سفارش‌های شما",
    subtitle: "این یک ساختار نمایشی محلی است. برای دیدن داده‌ی واقعی، Supabase و Prisma را متصل کنید.",
    credits: "تابلوهای ذخیره‌شده",
    workspace: "سفارش‌ها",
    generate: "پیدا کردن تابلو",
    library: "تاریخچه‌ی سفارش‌ها",
    settings: "تنظیمات",
    signOut: "خروج",
    empty: "هنوز سفارشی ثبت نشده. سفارش‌های شما اینجا نمایش داده می‌شود.",
  },
  discover: {
    title: "تابلوی خود را پیدا کنید",
    subtitle: "یک حال‌وهوا، یک پالت رنگی و یک بودجه انتخاب کنید تا شاهکارهای مناسب را نشان‌تان دهیم.",
    theme: "موضوع",
    color: "رنگ",
    budget: "بودجه",
    any: "همه",
    results: "تابلو",
    none: "فعلاً تابلویی با این فیلترها پیدا نشد؛ یکی از فیلترها را بازتر کنید.",
    clear: "پاک کردن فیلترها",
    categories: {
      landscape: "منظره",
      portrait: "چهره",
      floral: "گل",
      "still-life": "طبیعت بی‌جان",
      figures: "پیکره",
      animals: "حیوانات",
      abstract: "انتزاعی",
    },
    tones: {
      warm: "گرم",
      cool: "سرد",
      earthy: "خاکی",
      vivid: "زنده",
      muted: "ملایم",
    },
    budgets: ["زیر ۵ میلیون تومان", "۵ تا ۱۲ میلیون تومان", "بیش از ۱۲ میلیون تومان"],
  },
  detail: {
    by: "اثرِ",
    size: "اندازه",
    frame: "قاب",
    complexity: "پیچیدگی",
    complexities: { simple: "ساده", involved: "متوسط", intricate: "پرجزئیات" },
    total: "جمع",
    preview: "روی دیوارم نشان بده",
    request: "سفارش این تابلو",
    note: "اثر آزاد · دست‌ساز به‌سفارش شما",
    back: "بازگشت به گالری",
  },
  gallery: {
    title: "مجموعه",
    subtitle: "همه‌ی شاهکارهایی که می‌توانیم برای دیوار شما نقاشی کنیم. روی هر اثر بزنید تا آن را در اندازه‌ی کامل ببینید.",
    view: "دیدن در اندازه‌ی کامل",
    close: "بستن",
    prev: "قبلی",
    next: "بعدی",
    request: "سفارش این تابلو",
  },
  styles: {
    metaTitle: "راهنمای سبک‌های نقاشی — تاریخچه، استادان و چیدمان خانه",
    metaDescription:
      "راهنمایی بر سبک‌های بزرگ نقاشی که روی بوم بازآفرینی می‌کنیم — امپرسیونیسم، پساامپرسیونیسم، باروک، طبیعت بی‌جان هلندی، چهره‌نگاری کلاسیک، منظره‌ی رمانتیک و هنر انتزاعی — همراه با تاریخچه، نقاشان شاخص و سبکِ خانه‌ای که به هرکدام می‌آید.",
    eyebrow: "راهنما",
    title: "راهنمای سبک‌های نقاشی",
    intro:
      "نمی‌دانید کدام سبک به دیوار شما می‌آید؟ این یک مرور ساده از جنبش‌هایی است که با دست بازآفرینی می‌کنیم — اینکه هرکدام از کجا آمده، کدام نقاشان تعریفش کرده‌اند و به چه فضایی از خانه بیشتر می‌نشیند.",
    historyLabel: "تاریخچه",
    paintersLabel: "نقاشان شاخص",
    homeLabel: "مناسبِ خانه‌ای با حال‌وهوای",
    browse: "دیدن نمونه‌ها در گالری",
    cta: "تابلوی خود را پیدا کنید",
    items: [
      {
        name: "امپرسیونیسم",
        era: "دهه‌ی ۱۸۶۰ تا ۱۸۸۰ · فرانسه",
        history:
          "زمانی زاده شد که چند نقاش پاریسی استودیو را رها کردند و به دلِ فضای باز رفتند تا نور روز و لحظه‌های گذرا را با ضربه‌های تند و شکسته‌ی قلم‌مو شکار کنند. سالنِ رسمی پس‌شان زد، پس نمایشگاه خودشان را برپا کردند؛ و کنایه‌ی یک منتقد به تابلوی «برداشت، طلوع آفتاب» مونه، نامِ این جنبش شد.",
        painters: "کلود مونه، پی‌یر آگوست رنوار، ادگار دگا، کامی پیسارو",
        home: "روشن، سبک و بی‌تکلف — فضاهای اسکاندیناوی، ساحلیِ مدرن و مینیمالِ ملایم که یک تابلوی آفتابی در آن نفس می‌کشد.",
      },
      {
        name: "پساامپرسیونیسم",
        era: "دهه‌ی ۱۸۸۰ تا ۱۹۰۰ · فرانسه",
        history:
          "نسلِ پس از امپرسیونیسم پالتِ روشن را نگه داشت اما از مشاهده‌ی صرف فراتر رفت — به سمت رنگِ جسور، رنگ‌روغنِ ضخیم و احساسِ شخصی. هر هنرمند راه خودش را رفت؛ از انرژیِ چرخانِ ون‌گوگ تا فرم‌های هندسیِ سزان که درِ هنر مدرن را گشود.",
        painters: "ونسان ون‌گوگ، پل سزان، پل گوگن، ژرژ سورا",
        home: "گرم و پرشخصیت — فضاهای میدسنچری، التقاطی و بوهمی که از رنگِ پرمایه استقبال می‌کنند.",
      },
      {
        name: "باروک و استادان کهن",
        era: "سده‌ی هفدهم · اروپا",
        history:
          "روزگاری نمایشی از سایه‌های عمیق و نورِ دراماتیک (کیاروسکورو)، پارچه‌های فاخر و احساسِ پرشور. نقاشان برای دربارها و کلیساها کار می‌کردند و صحنه‌هایی می‌ساختند که بیننده را می‌گیرند و رها نمی‌کنند.",
        painters: "کاراواجو، رامبراند، دیه‌گو ولاسکز، یوهانس ورمیر",
        home: "رسمی و ماندگار — اتاق‌های مطالعه‌ی سنتی، کتابخانه‌های کلاسیک و غذاخوری‌های باشکوه.",
      },
      {
        name: "طبیعت بی‌جانِ عصر طلاییِ هلند",
        era: "سده‌ی هفدهم · هلند",
        history:
          "در جمهوریِ ثروتمندِ هلند، نقاشان چیزهای روزمره — شیشه، نقره، میوه و شمعی رو به خاموشی — را به تأملی آرام درباره‌ی فراوانی و ناپایداری بدل کردند؛ با دقتی باورنکردنی.",
        painters: "ویلم کلاس هدا، پیتر کلاس، کلارا پیترس، ویلم کالف",
        home: "کلاسیک و صمیمی — غذاخوری‌های شیک، آشپزخانه‌های کم‌نور و اتاق‌های کارِ چوب‌کوب.",
      },
      {
        name: "چهره‌نگاریِ رنسانس و کلاسیک",
        era: "سده‌ی پانزدهم تا نوزدهم · اروپا",
        history:
          "از رنسانس به بعد، چهره‌نگاری هنرِ «حضور» شد — ترکیب‌بندیِ متعادل، پرداختِ دقیقِ نور و سوژه‌ای که انگار از میان قرن‌ها به چشمِ شما نگاه می‌کند. استادانِ نئوکلاسیک بعدها آن را به کمالی سرد و خطی رساندند.",
        painters: "هانس مملینگ، رافائل، آنگر، الیزابت ویژه لوبرن",
        home: "برازنده و سنجیده — ورودی‌ها و راهروهای سنتی، ترنزیشنال و رسمی.",
      },
      {
        name: "منظره‌ی رمانتیک",
        era: "اواخر سده‌ی هجدهم تا نوزدهم · اروپا و آمریکا",
        history:
          "نقاشانِ رمانتیک طبیعت را به شخصیتِ اصلی بدل کردند — آسمان‌های پهناور، هوای دگرگون‌شونده و نوری که کاری شگفت می‌کند. منظره از یک پس‌زمینه به قلبِ احساسیِ تصویر تبدیل شد.",
        painters: "جوزف مالورد ویلیام ترنر، جان کانستبل، تئودور روسو، مکتب رودخانه‌ی هادسن",
        home: "آرامش‌بخش و طبیعی — فضاهای روستایی، فارم‌هاوس، بایوفیلیک و اتاق‌خواب‌های آرام.",
      },
      {
        name: "هنر انتزاعی و مدرنیسم",
        era: "اوایل سده‌ی بیستم · اروپا",
        history:
          "در سال‌های حوالیِ ۱۹۱۰، هنرمندان دست از نمایشِ جهان کشیدند و گذاشتند رنگ، فرم و خط خودشان سخن بگویند — از بداهه‌های موسیقاییِ کاندینسکی تا شبکه‌های موندریان و هندسه‌ی نابِ مالویچ. این هنوز زبانِ طراحیِ مدرن است.",
        painters: "واسیلی کاندینسکی، پیت موندریان، کازیمیر مالویچ، پل کله",
        home: "تمیز و امروزی — فضاهای مینیمال، باوهاوس، میدسنچری و تک‌رنگ که یک نقطه‌ی کانونیِ جسور می‌خواهند.",
      },
    ],
  },
  order: {
    title: "سفارش تابلوی شما",
    subtitle: "جزئیات را برای نقاش بفرستید؛ او زمان تحویل و قیمت نهایی را با شما هماهنگ می‌کند.",
    summary: "سفارش شما",
    name: "نام شما",
    contact: "ایمیل یا شماره‌ی تماس",
    contactHint: "تا نقاش بتواند با شما در تماس باشد.",
    address: "نشانی تحویل",
    note: "یادداشت برای نقاش (اختیاری)",
    submit: "ارسال سفارش",
    submitting: "در حال ارسال…",
    cancel: "انصراف",
    successTitle: "سفارش‌تان ثبت شد",
    successBody: "سفارش شما به دست نقاش رسید. او برای هماهنگی جزئیات، زمان تحویل و پرداخت با شما تماس می‌گیرد.",
    ref: "کد پیگیری",
    backHome: "بازگشت به خانه",
    browse: "دیدن تابلوهای بیشتر",
    error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
    demoNote: "حالت نمایشی: سفارش ذخیره نمی‌شود و ارسال به تلگرام تا زمان پیکربندی غیرفعال است.",
  },
  ar: {
    title: "روی دیوار خانه ببینید",
    start: "روشن کردن دوربین",
    upload: "بارگذاری عکس دیوار",
    snapshot: "ذخیره‌ی تصویر",
    close: "بستن",
    hint: "برای جابه‌جایی بکشید · با نوار لغزنده اندازه را تغییر دهید.",
    size: "اندازه روی دیوار",
    unsupported: "دوربین در دسترس نیست؛ به‌جایش عکسی از دیوارتان بارگذاری کنید.",
  },
  legal: {
    updated: "آخرین به‌روزرسانی: مرداد ۱۴۰۵",
    back: "بازگشت به خانه",
    privacy: {
      title: "سیاست حریم خصوصی",
      intro: "این سیاست توضیح می‌دهد نیلوسا هنگام ثبت سفارش چه اطلاعاتی جمع‌آوری می‌کند و چطور از آن استفاده می‌کند.",
      sections: [
        { h: "چه اطلاعاتی جمع‌آوری می‌کنیم", b: "هنگام سفارش تابلو، همان اطلاعاتی را که وارد می‌کنید نگه می‌داریم: نام، راه ارتباطی (ایمیل یا تلفن)، نشانی تحویل و یادداشت شما. نیازی به ساختن حساب نیست و در این سایت هیچ اطلاعات پرداختی گرفته نمی‌شود." },
        { h: "چطور از آن استفاده می‌کنیم", b: "اطلاعات شما تنها برای انجام همان سفارش به کار می‌رود؛ سفارش به نقاش فرستاده می‌شود و او برای تأیید اثر، زمان تحویل و قیمت با شما تماس می‌گیرد. ما داده‌های شما را نمی‌فروشیم." },
        { h: "با چه کسانی درمیان گذاشته می‌شود", b: "سفارش شما با نقاشِ مسئول آن (از راه تلگرام) و در صورت فعال بودن، تنها برای اجرای سرویس با ارائه‌دهنده‌های میزبانی و پایگاه‌داده درمیان گذاشته می‌شود." },
        { h: "آثار هنری", b: "تابلوهای نمایش‌داده‌شده از مجموعه‌های آزاد موزه‌ها گرفته شده‌اند و بازآفرینی آن‌ها قانونی است." },
        { h: "اختیار شما", b: "هر زمان بخواهید می‌توانید از راه صفحه‌ی تماس، دسترسی یا حذف اطلاعات سفارش‌تان را درخواست کنید." },
      ],
    },
    terms: {
      title: "قوانین و شرایط",
      intro: "با استفاده از نیلوسا و ثبت سفارش، این شرایط را می‌پذیرید.",
      sections: [
        { h: "سرویس", b: "نیلوسا امکان سفارش بازآفرینی دستیِ یک اثر آزاد روی بوم را فراهم می‌کند. ثبت سفارش یک خرید قطعی نیست؛ نقاش پیش از شروع کار و هر پرداختی، دامنه‌ی کار، زمان تحویل و قیمت نهایی را با شما تأیید می‌کند." },
        { h: "قیمت و پرداخت", b: "قیمت‌های نمایش‌داده‌شده تقریبی‌اند. قیمت و پرداخت نهایی مستقیم با نقاش هماهنگ می‌شود و در این وب‌سایت پرداختی گرفته نمی‌شود." },
        { h: "بازآفرینی‌ها", b: "همه‌ی آثار ارائه‌شده جزو آثار آزادند. هر تابلو یک بازآفرینی دستیِ اصیل با امضای نقاش است، نه یک کپی موبه‌موی جعلی." },
        { h: "تحویل", b: "زمان تحویل هر سفارش را نقاش اعلام می‌کند. نقاشی دستی زمان‌بر است و تاریخ‌ها تخمینی‌اند، نه تضمینی." },
        { h: "مسئولیت", b: "نیلوسا شما را به یک نقاش وصل می‌کند و «همان‌گونه که هست» ارائه می‌شود. تا جایی که قانون اجازه می‌دهد، مسئول خسارت‌های غیرمستقیم یا اتفاقی نیستیم." },
      ],
    },
    contact: {
      title: "تماس",
      intro: "درباره‌ی سفارش یا خودِ سایت پرسشی دارید؟ با کمال میل کمک می‌کنیم.",
      emailLabel: "ایمیل",
      email: "hello@niloosa.example",
      note: "برای پرسش‌های مربوط به سفارش، کد پیگیری‌تان (NIL-XXXXXX) را ذکر کنید.",
    },
  },
  common: {
    language: "زبان",
    theme: "پوسته",
    light: "روشن",
    dark: "تیره",
    system: "سیستم",
    by: "اثرِ",
  },
  artist: {
    eyebrow: "نقاش",
    name: "نیلوفر انصافیان",
    role: "نقاش · بنیان‌گذار نیلوسا",
    lead: "هر بوم نیلوسا با یک دست آفریده می‌شود.",
    intro:
      "نیلوفر انصافیان نقاشِ پشتِ نیلوسا است. چشمش را با نگاه به آثار استادان بزرگ پرورده و دستش را با سال‌ها کارِ آرام با رنگ‌روغن و بوم ورزیده است؛ و حالا هنرش این است که همان تابلوها — و آثار خودش — را روی دیوار خانه‌های واقعی بیاورد.",
    statementTitle: "به زبان خودش",
    statement:
      "من عکس چاپ نمی‌کنم؛ نقاشی می‌کنم. یک بازآفرینی باید همان وزنِ اثر اصلی را داشته باشد: برجستگیِ ردِ قلم‌مو، گرمای رنگ‌های لایه‌لایه و همان ناتمامی‌های کوچکی که می‌گویند انسانی روزها روبه‌روی این بوم ایستاده است. همین اثر است که می‌خواهم به دیوار خانه‌ی شما بفرستم.",
    quote: "دیوار، شایسته‌ی تابلویی است که آفریده شده، نه ساخته‌ی دستگاه.",
    ctaPrimary: "سفارش یک تابلو",
    ctaSecondary: "تماشای گالری",
    highlights: [
      { value: "رنگ‌روغن و اکریلیک", label: "روی بوم مرغوب" },
      { value: "امضای دستی", label: "روی تک‌تک آثار" },
      { value: "ساخت به‌سفارش", label: "برای دیوار شما" },
    ],
    stylesTitle: "سبک‌هایی که می‌کشد",
    stylesSubtitle:
      "از نورِ رهای امپرسیونیستی تا سکوتِ استادان کهن؛ زبانی را که می‌خواهید دیوارتان به آن سخن بگوید انتخاب کنید.",
    styles: [
      {
        name: "امپرسیونیسم و پساامپرسیونیسم",
        body: "قلم‌موی رها و پرنور و رنگ‌های زنده؛ ون‌گوگ، مونه و سزان با همان جنب‌وجوشِ اصلی‌شان روی بوم بازمی‌گردند.",
      },
      {
        name: "چهره‌نگاری کلاسیک",
        body: "پوست، پارچه و نگاه، با صبرِ نقاشانِ قدیم؛ چهره‌ای که لایه روی لایه ساخته می‌شود تا همه‌ی اتاق را در خود نگه دارد.",
      },
      {
        name: "طبیعت بی‌جانِ هلندی",
        body: "شیشه، نقره و میوه در دلِ سایه‌های عمیق؛ درامِ آرامِ عصر طلایی، تا ریزترین بازتابِ نور.",
      },
      {
        name: "گل و طبیعت",
        body: "امضای خودِ او: گل‌ها و برگ‌ها با پالت‌های گرم و امروزی که کنارِ دیوارهای مدرن به دل می‌نشینند.",
      },
      {
        name: "منظره‌های حال‌وهوادار",
        body: "جنگل‌ها، دشت‌ها و نورِ رو به خاموشی؛ منظره‌هایی گسترده و پرحس که به اتاق عمق می‌دهند و به چشم، جایی برای آرام‌گرفتن.",
      },
      {
        name: "پیکره‌های استادان کهن",
        body: "صحنه‌های متعادل و روایت‌گر در سنتِ ورمیر و داوید؛ تعادل، حرکت و نور، همه در نهایتِ دقت.",
      },
    ],
    commissionTitle: "چیز خاصی در ذهن دارید؟",
    commissionBody:
      "تابلویی را که دوست دارید — یا ایده‌ای از خودتان — بیاورید؛ نیلوفر آن را با دست بازآفرینی یا بازتعبیر می‌کند، در همان سبک و اندازه‌ای که فضای شما می‌طلبد.",
    commissionButton: "شروع سفارش",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
