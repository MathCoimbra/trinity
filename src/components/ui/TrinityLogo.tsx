import type { SVGProps } from "react";

export const PYRAMID_FACES = [
  { id: "left", points: "50,4 6,88 58,70", fill: "#8d8d94" },
  { id: "right", points: "50,4 58,70 94,88", fill: "#4a4a52" },
  { id: "base", points: "6,88 58,70 94,88", fill: "#1d1d22" },
] as const;

export function TrinityMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 92" aria-hidden="true" {...props}>
      {PYRAMID_FACES.map((face) => (
        <polygon key={face.id} points={face.points} fill={face.fill} />
      ))}
      <polyline
        points="50,4 58,70"
        fill="none"
        stroke="#b7b7bf"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

type TrinityLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function TrinityLogo({ className = "", showWordmark = true }: TrinityLogoProps) {
  return (
    <span className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <TrinityMark className="h-auto w-full" />
      {showWordmark && (
        <span className="font-display text-[1.15em] leading-none tracking-[0.28em] text-[#cfcfd4]">
          TRINITY
        </span>
      )}
    </span>
  );
}
