import type { Metadata, Viewport } from "next";
import "./globals.css";
import { dirOf } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/provider";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const ogImage =
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.title,
      template: "%s · Lotus",
    },
    description: dict.meta.description,
    applicationName: "Lotus",
    icons: { icon: "/logo.svg", apple: "/logo.svg" },
    robots: { index: true, follow: true },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      siteName: "Lotus",
      images: [{ url: ogImage, width: 1200, height: 900, alt: "Lotus" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF6" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1512" },
  ],
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeScript = `
try {
  var t = localStorage.getItem('lotus-theme');
  var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dict } = await getI18n();
  const dir = dirOf(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <I18nProvider value={{ locale, dir, dict }}>{children}</I18nProvider>
      </body>
    </html>
  );
}
