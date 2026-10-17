"use client";

import { useEffect, useState } from "react";
import { PYRAMID_FACES } from "@/components/ui/TrinityLogo";
import "./boot-loader.css";

export const BOOTED_STORAGE_KEY = "trinity:booted";
export const bootedFlagScript = `try{if(sessionStorage.getItem("${BOOTED_STORAGE_KEY}"))document.documentElement.dataset.booted="1"}catch(e){}`;

const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const MIN_DURATION_MS = 1900;
const REDUCED_MOTION_DURATION_MS = 500;
const EXIT_DURATION_MS = 600;
const PROGRESS_CAP_BEFORE_LOAD = 0.9;

type Phase = "loading" | "exiting" | "done";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? REDUCED_MOTION_DURATION_MS : MIN_DURATION_MS;
    const start = performance.now();
    let pageLoaded = document.readyState === "complete";
    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => {
      pageLoaded = true;
    };
    window.addEventListener("load", onLoad);
    document.body.style.overflow = "hidden";

    const tick = (now: number) => {
      const timeProgress = easeOutCubic(Math.min((now - start) / duration, 1));
      const next = pageLoaded ? timeProgress : Math.min(timeProgress, PROGRESS_CAP_BEFORE_LOAD);
      setProgress(next);

      if (next >= 1) {
        markBooted();
        setPhase("exiting");
        document.body.style.overflow = "";
        exitTimer = setTimeout(() => setPhase("done"), EXIT_DURATION_MS);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`boot-overlay ${phase === "exiting" ? "boot-exiting" : ""}`}
      role="progressbar"
      aria-label="Carregando a loja"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div className="boot-stage">
        <svg className="boot-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="boot-ringTrack" cx="50" cy="50" r={RING_RADIUS} />
          <circle
            className="boot-ringProgress"
            cx="50"
            cy="50"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          />
        </svg>

        <span className="boot-fragment" />
        <span className="boot-fragment" />
        <span className="boot-fragment" />
        <span className="boot-fragment" />

        <div className="boot-center">
          <svg className="boot-mark" viewBox="0 0 100 92" aria-hidden="true">
            {PYRAMID_FACES.map((face) => (
              <polygon key={face.id} className="boot-face" points={face.points} fill={face.fill} />
            ))}
          </svg>
          <span className="boot-word" data-text="TRINITY">
            TRINITY
          </span>
        </div>

        <span className="boot-percent">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
