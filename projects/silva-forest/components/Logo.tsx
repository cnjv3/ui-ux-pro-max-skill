type LogoProps = {
  className?: string;
};

/** Wordmark with a minimal botanical glyph: a stem with two paired leaves inside a ring. */
export default function Logo({ className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10.5" opacity="0.55" />
        <path d="M12 19.5V6.5" />
        <path d="M12 11.5c-2.6 0-4.3-1.6-4.6-4.1 2.6 0 4.3 1.6 4.6 4.1Z" />
        <path d="M12 15c2.6 0 4.3-1.6 4.6-4.1-2.6 0-4.3 1.6-4.6 4.1Z" />
      </svg>
      <span className="font-display text-[0.95rem] font-semibold tracking-[0.42em]">SILVA</span>
    </span>
  );
}
