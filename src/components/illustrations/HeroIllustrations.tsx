import type { CSSProperties, ReactNode } from "react";
import {
  BookStackScene,
  ChatCheckScene,
  DeskBookScene,
  PencilAccent,
  TeachBoardScene,
  TrendUpAccent,
} from "./scenes";

const STAGGER_MS = 130;

type FloatCfg = {
  /** peak vertical travel in px (negative = up) */
  y: number;
  /** peak tilt in deg */
  r?: number;
  /** full cycle in seconds */
  dur: number;
  /** phase offset in ms so no two elements share a rhythm */
  lag?: number;
};

/**
 * One scene in the entrance stagger. `float` gives it a continuous bob (see
 * .illus-float in globals.css); `halo` puts a soft indigo glow behind the anchor
 * scene.
 */
function Beat({
  index,
  float,
  halo,
  children,
}: {
  index: number;
  float?: FloatCfg;
  halo?: boolean;
  children: ReactNode;
}) {
  const style = {
    "--illus-delay": `${index * STAGGER_MS}ms`,
    ...(float && {
      "--float-y": `${float.y}px`,
      "--float-r": `${float.r ?? 0}deg`,
      "--float-dur": `${float.dur}s`,
      "--float-lag": `${float.lag ?? 120}ms`,
    }),
  } as CSSProperties;

  const scene = halo ? (
    <div className="relative isolate flex">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.13] blur-xl"
      />
      {children}
    </div>
  ) : (
    children
  );

  return (
    <div className={float ? "illus-enter illus-float" : "illus-enter"} style={style}>
      {scene}
    </div>
  );
}

/**
 * Decorative side panels for the landing hero — student side. Hidden below
 * `lg` (no room, and content matters more than decoration on small screens).
 */
export function HeroIllustrationLeft() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-10" aria-hidden>
      <Beat index={0} float={{ y: -18, dur: 2.8, lag: 100 }}>
        <ChatCheckScene />
      </Beat>
      <Beat index={1} halo>
        <DeskBookScene />
      </Beat>
      <Beat index={2} float={{ y: -14, r: 4, dur: 3.3, lag: 320 }}>
        <PencilAccent />
      </Beat>
    </div>
  );
}

/** Decorative side panel — tutor side. */
export function HeroIllustrationRight() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-10" aria-hidden>
      <Beat index={0} float={{ y: -13, dur: 3.6, lag: 480 }}>
        <BookStackScene />
      </Beat>
      <Beat index={1} halo>
        <TeachBoardScene />
      </Beat>
      <Beat index={2} float={{ y: -18, dur: 3.0, lag: 220 }}>
        <TrendUpAccent />
      </Beat>
    </div>
  );
}
