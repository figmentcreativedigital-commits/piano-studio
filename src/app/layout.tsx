import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/source-serif-4/opsz-italic.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ReaderBar } from "@/components/ReadAloud";
import { Tour } from "@/components/Tour";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Woodshed", template: "%s | Woodshed" },
  description: "A practice studio for bebop piano and Bach: Barry Harris's harmony, Bud Powell, Horace Silver and Sonny Clark, and Bach's inventions, taught one session at a time.",
  openGraph: {
    title: "Woodshed",
    description: "A practice studio for bebop piano and Bach, built around one student's hands, ears and schedule.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Woodshed: a lesson presented as a record sleeve" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0267b2" },
    { media: "(prefers-color-scheme: dark)", color: "#0267b2" },
  ],
};

const themeScript = `try{var p=JSON.parse(localStorage.getItem('woodshed.prefs.v1')||'{}');if(p.theme==='light'||p.theme==='dark')document.documentElement.dataset.theme=p.theme}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only skip">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <span>Woodshed, a piano studio for Walter Gross. Practice data stays on this device.</span>
            <nav aria-label="Footer">
              <Link href="/tunes">The three tunes</Link>
              <Link href="/method">How it works</Link>
              <a href="/calendar.ics">Calendar file (.ics)</a>
              <a href="/baseline.html">Baseline session</a>
            </nav>
          </div>
        </footer>
        <ReaderBar />
        <Tour />
      </body>
    </html>
  );
}
