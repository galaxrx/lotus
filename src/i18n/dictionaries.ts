import type { Locale } from "./config";

/**
 * UI copy for Niloosa — the hand-painted wall-art commissioning app — in English
 * and Persian. `en` defines the canonical shape; `fa` must match it.
 */
const en = {
  meta: {
    title: "Niloosa — Hand-painted masterpieces for your wall",
    description:
      "Pick a painting you love, see it on your own wall before you decide, and have a painter reproduce it by hand on canvas, with real brush texture and her signature on the back.",
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
      "Pick a masterpiece by colour, style and budget. Hold your phone up to the wall and see it there at full size. Then a painter reproduces it on canvas by hand, brushstrokes and all.",
    ctaPrimary: "Find your painting",
    ctaSecondary: "See how it works",
    note: "Painted, never printed · Museum public-domain sources · Look before you commit",
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
        body: "Tell us a theme, a colour, and what you want to spend. You get a short list of real paintings that fit, instead of endless scrolling.",
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
      "A hand-picked set from the world's great museums. Every one is public domain, so every one can be painted for you.",
    cta: "Enter the gallery",
    viewAll: "Browse all paintings",
  },
  wall: {
    eyebrow: "Preview in AR",
    title: "See it on your wall before you commit.",
    body: "A painting can look perfect on a screen and wrong above the sofa. Open your camera, drop the framed canvas onto the wall at its real size, and shift it around until it sits where it should.",
    points: [
      "Framed preview at true size",
      "Runs in your browser, nothing to install",
      "Take a photo and compare rooms later",
    ],
    note: "Point, place, picture it.",
  },
  sizes: {
    eyebrow: "Sizes & pricing",
    title: "Simple sizes. Honest pricing.",
    subtitle:
      "The artwork itself is public domain. What you pay for is the painter's time and the canvas. Pick a size and a frame, then settle the details with her directly.",
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
    disclaimer: "These are starting prices. What you actually pay depends on the size, the frame and how much detail the painting demands, and it's agreed with the painter before you pay anything.",
  },
  values: {
    eyebrow: "Why Niloosa",
    title: "Real art, made the real way.",
    items: [
      {
        title: "An artwork, not a print",
        body: "Every piece starts as a genuine painting from a museum's public-domain collection, and a person paints it again for you, by hand.",
      },
      {
        title: "Texture you can see",
        body: "Oil on canvas, brushwork you can catch in raking light, and the painter's signature. A print has none of that.",
      },
      {
        title: "Look before you pay",
        body: "See it on your own wall and lock in the size and frame first. Nothing about the delivery should surprise you.",
      },
      {
        title: "Legally yours",
        body: "We only work from public-domain masterworks, so the painting you commission is yours without any copyright worry.",
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
        a: "Public-domain collections at major museums, like The Met. That's what makes painting them by hand legal and worry-free.",
      },
      {
        q: "How do I order?",
        a: "Pick a painting, a size and a frame, then send the request. It lands with the painter on Telegram and she confirms the details and price with you directly.",
      },
      {
        q: "How does the wall preview work?",
        a: "Your phone camera puts the framed canvas on your wall at its real size, right in the browser. There's nothing to install.",
      },
      {
        q: "How long does it take?",
        a: "Painting by hand takes time. You'll get a timeline when the painter confirms your order, usually a few weeks.",
      },
    ],
  },
  cta: {
    title: "Find the painting your wall is missing.",
    subtitle: "Look through the collection, try one at home, and let a painter bring it to life.",
    button: "Find your painting",
    note: "Takes about a minute.",
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
    subtitle: "Pick a mood, a palette and a budget, and we'll show you the masterpieces that fit.",
    theme: "Theme",
    color: "Color tone",
    budget: "Budget",
    any: "Any",
    results: "paintings",
    none: "Nothing matches those filters yet. Try loosening one.",
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
    subtitle: "Everything we can paint for your wall. Tap any piece to see it full size.",
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
      "Not sure which style belongs on your wall? Here's a plain tour of the movements we paint: where each one came from, the painters who defined it, and the kind of home it settles into best.",
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
          "It began when a handful of Paris painters left the studio for the open air, chasing daylight with quick, broken strokes. The official Salon rejected them, so they staged their own shows. The name came from a critic mocking Monet's “Impression, Sunrise”.",
        painters: "Claude Monet, Pierre-Auguste Renoir, Edgar Degas, Camille Pissarro",
        home: "Light, airy and unfussy. Think Scandinavian, modern-coastal or soft-minimalist rooms where a sunny canvas has space to breathe.",
      },
      {
        name: "Post-Impressionism",
        era: "1880s–1900s · France",
        history:
          "The generation after Impressionism kept the bright palette but stopped merely recording what they saw. They pushed into bold colour, thick paint and private feeling, each in their own direction: Van Gogh's swirling energy, Cézanne's blocks of form that cracked open modern art.",
        painters: "Vincent van Gogh, Paul Cézanne, Paul Gauguin, Georges Seurat",
        home: "Warm and full of character. Mid-century modern, eclectic and bohemian rooms take strong colour well.",
      },
      {
        name: "Baroque & the Old Masters",
        era: "17th century · Europe",
        history:
          "A theatrical age of deep shadow and dramatic light (chiaroscuro), rich fabrics and charged emotion. Painters worked for courts and churches, staging scenes that reach out and grip the viewer.",
        painters: "Caravaggio, Rembrandt van Rijn, Diego Velázquez, Johannes Vermeer",
        home: "Formal and timeless. Traditional studies, dark-academia libraries, dining rooms that want some drama.",
      },
      {
        name: "Dutch Golden Age Still Life",
        era: "17th century · The Netherlands",
        history:
          "In the wealthy Dutch Republic, painters took ordinary things (glassware, silver, fruit, a guttering candle) and turned them into quiet arguments about abundance and death, painted with almost unbelievable precision.",
        painters: "Willem Claesz Heda, Pieter Claesz, Clara Peeters, Willem Kalf",
        home: "Classic and intimate. Refined dining rooms, moody kitchens, panelled studies.",
      },
      {
        name: "Renaissance & Classical Portraiture",
        era: "15th–19th century · Europe",
        history:
          "From the Renaissance onward, portraiture became the art of presence: balanced composition, light modelled with care, and a sitter who still meets your eye centuries later. The neoclassical masters later sharpened it into a cool, linear perfection.",
        painters: "Hans Memling, Raphael, J. A. D. Ingres, Élisabeth Vigée Le Brun",
        home: "Elegant and considered. Traditional and transitional interiors, formal entryways, hallways.",
      },
      {
        name: "Romantic Landscape",
        era: "Late 18th–19th century · Europe & America",
        history:
          "Romantic painters made nature the main character: vast skies, turning weather, light doing something extraordinary. Landscape stopped being a backdrop and became the emotional heart of the picture.",
        painters: "J. M. W. Turner, John Constable, Théodore Rousseau, the Hudson River School",
        home: "Grounding and natural. Rustic and farmhouse interiors, plant-filled rooms, quiet bedrooms.",
      },
      {
        name: "Abstract Art & Modernism",
        era: "Early 20th century · Europe",
        history:
          "Around 1910 artists stopped depicting the world and let colour, shape and line carry the meaning themselves: Kandinsky's musical improvisations, Mondrian's grids, Malevich's bare geometry. It's still the language modern design speaks.",
        painters: "Wassily Kandinsky, Piet Mondrian, Kazimir Malevich, Paul Klee",
        home: "Clean and contemporary. Minimalist, Bauhaus, mid-century and monochrome rooms that need one bold focal point.",
      },
    ],
  },
  order: {
    title: "Request your painting",
    subtitle: "Send your details to the painter. She'll confirm the timeline and the final price with you.",
    summary: "Your commission",
    name: "Your name",
    contact: "Email or phone",
    contactHint: "So the painter can get back to you.",
    address: "Delivery address",
    note: "Anything you'd like the painter to know (optional)",
    submit: "Send request",
    submitting: "Sending…",
    cancel: "Cancel",
    successTitle: "Request sent",
    successBody: "Your request reached the painter. She'll be in touch to confirm the details, the timeline and how to pay.",
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
    snapshot: "Take photo",
    capturing: "Capturing…",
    captured: "Your wall preview",
    share: "Share or save",
    download: "Download",
    saveHint: "Tap Share to save it to your photos, or press and hold the image.",
    close: "Close",
    hint: "Drag to move it. Use the slider to resize.",
    size: "Size on wall",
    unsupported: "We couldn't open the camera. Upload a photo of your wall instead.",
  },
  legal: {
    updated: "Last updated: August 2026",
    back: "Back to home",
    privacy: {
      title: "Privacy Policy",
      intro: "This policy explains what Niloosa collects when you request a commission and how it is used.",
      sections: [
        { h: "What we collect", b: "When you request a painting we keep what you type in: your name, your email or phone, the delivery address, and any note you leave. You don't need an account, and we never ask for payment details on this site." },
        { h: "How we use it", b: "Your details go to the painter so she can build your piece and contact you about the artwork, the timeline and the price. That's all. We don't sell your data." },
        { h: "Sharing", b: "Your request goes to the painter handling your order, over Telegram. Where they're switched on, our hosting and database providers also process it, purely to keep the site running." },
        { h: "Artworks", b: "The paintings shown come from public-domain museum collections and are reproduced lawfully." },
        { h: "Your choices", b: "Write to us on the contact page any time and we'll show you what we hold or delete it." },
      ],
    },
    terms: {
      title: "Terms of Service",
      intro: "By using Niloosa and requesting a commission, you agree to these terms.",
      sections: [
        { h: "The service", b: "Niloosa lets you ask for a hand-painted canvas version of a public-domain artwork. Sending a request doesn't commit you to anything. The painter agrees the scope, timeline and final price with you before any work starts or any money changes hands." },
        { h: "Pricing & payment", b: "The prices here are a guide. The real figure and the payment itself are arranged directly with the painter. This website never takes payment." },
        { h: "Reproductions", b: "Every artwork we offer is in the public domain. What you receive is an original hand-painted version signed by the painter, not a forgery passed off as the original." },
        { h: "Delivery", b: "The painter gives you a timeline for your own order. Painting by hand takes time, so treat any date as an estimate rather than a guarantee." },
        { h: "Liability", b: "Niloosa puts you in touch with a painter and is provided “as is”. So far as the law allows, we aren't liable for indirect or incidental damages." },
      ],
    },
    contact: {
      title: "Contact",
      intro: "Questions about an order or about the site? Write to us, we're happy to help.",
      emailLabel: "Email",
      email: "hello@niloosa.example",
      note: "If it's about an order, include your reference code (NIL-XXXXXX) so we can find it.",
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
    lead: "Every Niloosa canvas comes from the same pair of hands.",
    intro:
      "Niloofar Ensafian is the painter behind Niloosa. She trained her eye on the great masters and her hand on the slow work of oil and canvas, and she now spends her days putting those paintings, and her own, onto the walls of real homes.",
    statementTitle: "In her words",
    statement:
      "I paint pictures, I don't print them. A reproduction should carry the same weight as the original: the ridge of a brushstroke, the warmth of layered colour, the small imperfections that tell you someone stood in front of this canvas for days. That's what I want to send to your wall.",
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
      "From loose impressionist light to the stillness of the old masters. Pick the language your wall should speak.",
    styles: [
      {
        name: "Impressionism & Post-Impressionism",
        body: "Loose, luminous brushwork and living colour. Van Gogh, Monet and Cézanne, back on canvas with their movement intact.",
      },
      {
        name: "Classical Portraiture",
        body: "Skin, fabric and gaze done with old-world patience: a face built layer over layer until it holds the room.",
      },
      {
        name: "Dutch Still Life",
        body: "Glass, silver and fruit lit against deep shadow. The quiet drama of the Golden Age, down to the last reflection.",
      },
      {
        name: "Floral & Botanical",
        body: "Her own register. Blooms and foliage in warm, modern palettes that sit well on a contemporary wall.",
      },
      {
        name: "Atmospheric Landscape",
        body: "Forests, fields and failing light. Wide, moody scenes that give a room depth and the eye somewhere to rest.",
      },
      {
        name: "Old Master Figures",
        body: "Composed, story-telling scenes in the tradition of Vermeer and David, with balance, gesture and light held in check.",
      },
    ],
    commissionTitle: "Have something specific in mind?",
    commissionBody:
      "Bring a painting you love, or an idea of your own, and Niloofar will reproduce or reinterpret it by hand at the size and in the style your space needs.",
    commissionButton: "Start a commission",
  },
};

export type Dictionary = typeof en;

const fa: Dictionary = {
  meta: {
    title: "نیلوسا | تابلوهای دست‌ساز برای دیوار خانه‌ی شما",
    description:
      "تابلویی را که دوست دارید انتخاب کنید، پیش از سفارش آن را روی دیوار خانه‌تان ببینید و بعد نقاش با دست روی بوم برایتان می‌کشدش؛ با بافت واقعی رنگ و امضای خودش.",
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
    eyebrow: "نقاشی دستی · از شاهکارهای ماندگار جهان",
    titleLead: "یک نقاشی واقعی روی دیوار خانه‌تان،",
    titleAccent: "کارِ دستِ یک نقاش.",
    subtitle:
      "بر اساس رنگ، حال‌وهوا و بودجه‌تان یک شاهکار انتخاب کنید. گوشی را روبه‌روی دیوار بگیرید و همان‌جا در اندازه‌ی واقعی ببینیدش. بعد نقاش با قلم‌مو روی بوم برایتان می‌کشدش.",
    ctaPrimary: "تابلوی خود را پیدا کنید",
    ctaSecondary: "ببینید چطور کار می‌کند",
    note: "نقاشی‌شده، نه چاپ‌شده · برگرفته از آثار آزاد موزه‌ای · پیش از سفارش ببینیدش",
  },
  marquee: [
    "شاهکارهای ماندگار جهان",
    "نقاشی دستی روی بوم",
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
        body: "کافی است حال‌وهوا، رنگ و بودجه‌ی دلخواهتان را بگویید. به‌جای ساعت‌ها گشتن، چند تابلوی مناسب پیش رویتان می‌آید.",
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
      "گزیده‌ای دست‌چین از بزرگ‌ترین موزه‌های جهان. همه‌شان از آثار آزادند، پس همه‌شان را می‌شود برایتان کشید.",
    cta: "ورود به گالری",
    viewAll: "دیدن همه‌ی تابلوها",
  },
  wall: {
    eyebrow: "پیش‌نمایش روی دیوار",
    title: "پیش از سفارش، روی دیوار خانه ببینیدش.",
    body: "یک تابلو ممکن است روی صفحه‌ی گوشی عالی به نظر برسد و بالای مبل اصلاً جور درنیاید. دوربین را باز کنید، تابلوی قاب‌شده را در اندازه‌ی واقعی روی دیوار بگذارید و آن‌قدر جابه‌جایش کنید تا سرِ جای خودش بنشیند.",
    points: [
      "نمایش قاب‌شده در اندازه‌ی واقعی",
      "داخل مرورگر اجرا می‌شود و نیازی به نصب برنامه نیست",
      "عکس بگیرید تا بعداً اتاق‌ها را با هم بسنجید",
    ],
    note: "بگیرید، بگذارید، ببینید.",
  },
  sizes: {
    eyebrow: "اندازه و قیمت",
    title: "اندازه‌های ساده، قیمت شفاف.",
    subtitle:
      "خودِ اثر از آثار آزاد است. چیزی که می‌پردازید بابت وقتِ نقاش و بوم است. اندازه و قاب را انتخاب کنید و باقی جزئیات را مستقیم با خودش هماهنگ کنید.",
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
    disclaimer: "این‌ها قیمت‌های شروع است. رقم نهایی به اندازه، قاب و میزان جزئیاتِ کار بستگی دارد و پیش از اینکه چیزی بپردازید با نقاش نهایی می‌شود.",
  },
  values: {
    eyebrow: "چرا نیلوسا",
    title: "هنر واقعی، به شیوه‌ی واقعی.",
    items: [
      {
        title: "یک اثر هنری، نه یک چاپ",
        body: "هر تابلو یک اثر اصیل از مجموعه‌ی آثار آزاد موزه‌هاست که این بار با دستِ یک نقاش دوباره کشیده می‌شود.",
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
    subtitle: "مشخصاتتان را برای نقاش بفرستید. خودش زمان تحویل و قیمت نهایی را با شما هماهنگ می‌کند.",
    summary: "سفارش شما",
    name: "نام شما",
    contact: "ایمیل یا شماره‌ی تماس",
    contactHint: "تا نقاش بتواند جوابتان را بدهد.",
    address: "نشانی تحویل",
    note: "هر چیزی که دوست دارید نقاش بداند (اختیاری)",
    submit: "ارسال سفارش",
    submitting: "در حال ارسال…",
    cancel: "انصراف",
    successTitle: "سفارش‌تان ثبت شد",
    successBody: "سفارشتان به دست نقاش رسید. برای هماهنگی جزئیات، زمان تحویل و نحوه‌ی پرداخت با شما تماس می‌گیرد.",
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
    snapshot: "گرفتن عکس",
    capturing: "در حال گرفتن عکس…",
    captured: "پیش‌نمایش دیوار شما",
    share: "اشتراک‌گذاری یا ذخیره",
    download: "دانلود",
    saveHint: "برای ذخیره در گالری، روی اشتراک‌گذاری بزنید یا انگشتتان را روی عکس نگه دارید.",
    close: "بستن",
    hint: "برای جابه‌جایی بکشید. با نوار لغزنده اندازه را تغییر دهید.",
    size: "اندازه روی دیوار",
    unsupported: "نتوانستیم دوربین را باز کنیم. به‌جایش عکسی از دیوارتان بارگذاری کنید.",
  },
  legal: {
    updated: "آخرین به‌روزرسانی: مرداد ۱۴۰۵",
    back: "بازگشت به خانه",
    privacy: {
      title: "سیاست حریم خصوصی",
      intro: "این سیاست توضیح می‌دهد نیلوسا هنگام ثبت سفارش چه اطلاعاتی جمع‌آوری می‌کند و چطور از آن استفاده می‌کند.",
      sections: [
        { h: "چه اطلاعاتی نگه می‌داریم", b: "وقتی تابلویی سفارش می‌دهید، همان چیزهایی را که خودتان می‌نویسید نگه می‌داریم: نام، ایمیل یا شماره‌ی تماس، نشانی تحویل و یادداشتی که می‌گذارید. نیازی به ساختن حساب نیست و در این سایت هیچ‌وقت اطلاعات پرداخت از شما نمی‌خواهیم." },
        { h: "چطور ازش استفاده می‌کنیم", b: "اطلاعات شما می‌رود پیش نقاش تا کارتان را شروع کند و درباره‌ی اثر، زمان تحویل و قیمت با شما حرف بزند. همین. داده‌های شما را به کسی نمی‌فروشیم." },
        { h: "با چه کسانی درمیان گذاشته می‌شود", b: "سفارش شما از راه تلگرام می‌رسد به نقاشی که کار را انجام می‌دهد. سرویس‌های میزبانی و پایگاه‌داده هم، اگر فعال باشند، فقط برای اینکه سایت کار کند آن را پردازش می‌کنند." },
        { h: "آثار هنری", b: "تابلوهایی که می‌بینید از مجموعه‌های آزاد موزه‌ها می‌آیند و بازآفرینی‌شان قانونی است." },
        { h: "اختیار با شماست", b: "هر وقت خواستید از صفحه‌ی تماس به ما بنویسید تا بگوییم چه اطلاعاتی از شما داریم یا پاکش کنیم." },
      ],
    },
    terms: {
      title: "قوانین و شرایط",
      intro: "با استفاده از نیلوسا و ثبت سفارش، این شرایط را می‌پذیرید.",
      sections: [
        { h: "سرویس", b: "نیلوسا این امکان را می‌دهد که یک اثر آزاد را سفارش دهید تا با دست روی بوم کشیده شود. ثبت سفارش شما را به چیزی متعهد نمی‌کند؛ نقاش پیش از شروع کار و پیش از هر پرداختی، حدود کار و زمان تحویل و قیمت نهایی را با شما نهایی می‌کند." },
        { h: "قیمت و پرداخت", b: "قیمت‌هایی که اینجا می‌بینید راهنماست. رقم واقعی و خودِ پرداخت مستقیم با نقاش هماهنگ می‌شود. این وب‌سایت هیچ‌وقت پولی دریافت نمی‌کند." },
        { h: "بازآفرینی‌ها", b: "همه‌ی آثاری که ارائه می‌کنیم جزو آثار آزادند. چیزی که به دستتان می‌رسد یک نقاشی دستیِ اصیل با امضای نقاش است، نه کپی‌ای که به‌جای اثر اصلی جا زده شود." },
        { h: "تحویل", b: "زمان تحویلِ سفارش شما را خود نقاش اعلام می‌کند. نقاشی با دست زمان می‌برد، پس هر تاریخی را تخمینی در نظر بگیرید، نه قطعی." },
        { h: "مسئولیت", b: "نیلوسا شما را به یک نقاش وصل می‌کند و «همان‌گونه که هست» ارائه می‌شود. تا جایی که قانون اجازه می‌دهد، مسئول خسارت‌های غیرمستقیم یا اتفاقی نیستیم." },
      ],
    },
    contact: {
      title: "تماس",
      intro: "درباره‌ی سفارش یا خودِ سایت سؤالی دارید؟ برایمان بنویسید، با کمال میل کمک می‌کنیم.",
      emailLabel: "ایمیل",
      email: "hello@niloosa.example",
      note: "اگر درباره‌ی سفارش است، کد پیگیری‌تان (NIL-XXXXXX) را هم بنویسید تا زودتر پیدایش کنیم.",
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
    lead: "همه‌ی تابلوهای نیلوسا کارِ یک جفت دست است.",
    intro:
      "نیلوفر انصافیان نقاشِ پشتِ نیلوسا است. چشمش را با نگاه‌کردن به آثار استادان بزرگ پرورده و دستش را با سال‌ها کارِ آرام با رنگ‌روغن و بوم. حالا روزهایش را صرف این می‌کند که همان تابلوها، و آثار خودش، سر از دیوار خانه‌های واقعی دربیاورند.",
    statementTitle: "به زبان خودش",
    statement:
      "من نقاشی می‌کنم، عکس چاپ نمی‌کنم. یک بازآفرینی باید همان وزنِ اثر اصلی را داشته باشد: برجستگیِ ردِ قلم‌مو، گرمای رنگ‌های لایه‌لایه و همان ناتمامی‌های کوچکی که نشان می‌دهد کسی روزها روبه‌روی این بوم ایستاده. همین است که می‌خواهم به دیوار خانه‌ی شما برسد.",
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
