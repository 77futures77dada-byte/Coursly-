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

/**
 * One scene in the entrance stagger. `float` marks the single element that keeps
 * a gentle continuous motion after landing (see .illus-float in globals.css).
 */
function Beat({ index, float, children }: { index: number; float?: boolean; children: ReactNode }) {
  return (
    <div
      className={float ? "illus-enter illus-float" : "illus-enter"}
      style={{ "--illus-delay": `${index * STAGGER_MS}ms` } as CSSProperties}
    >
      {children}
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
      <Beat index={0} float>
        <ChatCheckScene />
      </Beat>
      <Beat index={1}>
        <DeskBookScene />
      </Beat>
      <Beat index={2}>
        <PencilAccent />
      </Beat>
    </div>
  );
}

/** Decorative side panel — tutor side. */
export function HeroIllustrationRight() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-10" aria-hidden>
      <Beat index={0}>
        <BookStackScene />
      </Beat>
      <Beat index={1}>
        <TeachBoardScene />
      </Beat>
      <Beat index={2}>
        <TrendUpAccent />
      </Beat>
    </div>
  );
}
