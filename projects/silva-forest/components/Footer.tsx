import Logo from "./Logo";
import { contactEmail, navLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bone/10 bg-ink px-5 pb-10 pt-20 sm:px-[4vw] lg:px-[7vw]">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <a href="#top" aria-label="SILVA, back to top" className="text-bone">
            <Logo />
          </a>
          <p className="mt-6 max-w-sm font-light leading-relaxed text-mineral">
            Guardians of the forest. Protecting standing forests, restoring degraded land and preserving biodiversity
            for the generations to come.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
          <p className="label text-mineral/80">Explore</p>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-bone/85 transition-colors hover:text-lime">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="label text-mineral/80">Contact</p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-5 inline-block break-all text-bone/85 transition-colors hover:text-lime"
          >
            {contactEmail}
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mt-20 select-none font-display text-[clamp(4.5rem,22vw,20rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-bone/[0.06]"
      >
        SILVA
      </p>

      <div className="mt-8 flex flex-col gap-4 border-t border-bone/10 pt-6 text-xs font-light leading-relaxed text-mineral/80 md:flex-row md:justify-between">
        <p>© {year} SILVA. All rights reserved.</p>
        <p className="max-w-2xl md:text-right">
          Legal notice: SILVA — Guardians of the Forest is a demonstration website. Projects shown are illustrative.
          Photography from Unsplash, used under the Unsplash License.
        </p>
      </div>
    </footer>
  );
}
