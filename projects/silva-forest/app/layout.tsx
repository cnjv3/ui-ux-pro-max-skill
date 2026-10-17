import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILVA — Guardians of the Forest",
  description:
    "Preserving the world's forests, restoring damaged ecosystems and protecting the biodiversity that sustains life on Earth.",
};

export const viewport: Viewport = {
  themeColor: "#050706",
  width: "device-width",
  initialScale: 1,
};

// Marks the document as script-capable before first paint, so scroll-reveal
// content is only hidden when something is guaranteed to reveal it again.
const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="font-sans">
        <a href="#hero-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
