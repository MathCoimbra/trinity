import type { CSSProperties, SVGProps } from "react";

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

const WORDMARK_MASK_URL = "url(/images/trinity-wordmark.png)";

export const wordmarkMaskStyle: CSSProperties = {
  aspectRatio: "1200 / 219",
  backgroundColor: "currentColor",
  maskImage: WORDMARK_MASK_URL,
  WebkitMaskImage: WORDMARK_MASK_URL,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
};

export function TrinityWordmark({ className = "" }: { className?: string }) {
  return <span role="img" aria-label="Trinity" className={`block ${className}`} style={wordmarkMaskStyle} />;
}

type TrinityLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function TrinityLogo({ className = "", showWordmark = true }: TrinityLogoProps) {
  return (
    <span className={`inline-flex flex-col items-center gap-[12%] ${className}`}>
      <TrinityMark className="h-auto w-[78%]" />
      {showWordmark && <TrinityWordmark className="w-full text-muted" />}
    </span>
  );
}
