"use client";

import { useEffect, useState } from "react";
import { PYRAMID_FACES, wordmarkMaskStyle } from "@/components/ui/TrinityLogo";
import "./boot-loader.css";

export const BOOTED_STORAGE_KEY = "trinity:booted";
export const bootedFlagScript = `try{if(sessionStorage.getItem("${BOOTED_STORAGE_KEY}"))document.documentElement.dataset.booted="1"}catch(e){}`;

const PROGRESS_DURATION_MS = 2300;
const HOLD_AT_FULL_MS = 150;
const EXIT_DURATION_MS = 750;
const PROGRESS_CAP_BEFORE_LOAD = 0.9;
const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const OUTLINE_PATH = "M50 4 L6 88 L94 88 Z M50 4 L58 70 M6 88 L58 70 L94 88";
const FRAGMENT_COUNT = 6;

type Phase = "loading" | "exiting" | "done";

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function markBooted() {
  try {
    sessionStorage.setItem(BOOTED_STORAGE_KEY, "1");
  } catch {}
}

export function BootLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (document.documentElement.dataset.booted) return;

    const start = performance.now();
    let pageLoaded = document.readyState === "complete";
    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const onLoad = () => {
      pageLoaded = true;
    };
    window.addEventListener("load", onLoad);
    document.body.style.overflow = "hidden";

    const tick = (now: number) => {
      const timeProgress = easeInOutSine(Math.min((now - start) / PROGRESS_DURATION_MS, 1));
      const next = pageLoaded ? timeProgress : Math.min(timeProgress, PROGRESS_CAP_BEFORE_LOAD);
      setProgress(next);

      if (next < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      timers.push(
        setTimeout(() => {
          markBooted();
          setPhase("exiting");
          document.body.style.overflow = "";
          timers.push(setTimeout(() => setPhase("done"), EXIT_DURATION_MS));
        }, HOLD_AT_FULL_MS),
      );
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const percent = Math.round(progress * 100);

  return (
    <div
      className={`boot-overlay ${phase === "exiting" ? "boot-exiting" : ""}`}
      role="progressbar"
      aria-label="Carregando a loja"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <span className="boot-seam" />

      <div className="boot-stage">
        <svg className="boot-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="boot-ring-track" cx="50" cy="50" r={RING_RADIUS} />
          <circle
            className="boot-ring-progress"
            cx="50"
            cy="50"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          />
        </svg>

        {Array.from({ length: FRAGMENT_COUNT }, (_, index) => (
          <span key={index} className="boot-fragment" />
        ))}

        <div className="boot-center">
          <svg className="boot-mark" viewBox="-4 -4 108 100" aria-hidden="true">
            {PYRAMID_FACES.map((face) => (
              <polygon key={face.id} className="boot-face" points={face.points} fill={face.fill} />
            ))}
            <path className="boot-outline" d={OUTLINE_PATH} pathLength={1} />
          </svg>

          <span className="boot-word" role="img" aria-label="Trinity">
            <span className="boot-word-fill" style={wordmarkMaskStyle} />
            <span className="boot-word-layer boot-word-layer-a" style={wordmarkMaskStyle} />
            <span className="boot-word-layer boot-word-layer-b" style={wordmarkMaskStyle} />
          </span>

          <span className="boot-sub">
            <span className="boot-sub-line" />
            HOOKAH
            <span className="boot-sub-line" />
          </span>
        </div>

        <span className="boot-percent">{percent}%</span>
      </div>
    </div>
  );
}
