type ArrowIconProps = {
  className?: string;
  direction?: "right" | "down" | "up-right";
};

const rotation = { right: "", down: "rotate-90", "up-right": "-rotate-45" } as const;

export default function ArrowIcon({ className, direction = "right" }: ArrowIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`${rotation[direction]} ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
