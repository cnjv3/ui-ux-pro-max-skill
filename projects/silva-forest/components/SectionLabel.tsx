type SectionLabelProps = {
  index: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <p data-reveal="fade" className={`label flex items-center gap-4 text-mineral ${className ?? ""}`}>
      <span className="text-lime">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-bone/25" />
      {children}
    </p>
  );
}
