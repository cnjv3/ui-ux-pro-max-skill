import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.fullName} — Where Flavor Becomes Art`,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Marks the document as motion-capable so entrance
 * elements can start hidden; a timeout reveals everything if animation code
 * never runs (slow network, script error).
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');setTimeout(function(){d.classList.add('motion-fallback')},4000)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <SmoothScroll>
          <div id="app-root">{children}</div>
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
