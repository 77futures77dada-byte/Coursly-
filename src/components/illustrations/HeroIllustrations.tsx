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
 * One scene in the entrance stagger. `float` marks an element that keeps a gentle
 * continuous motion after landing; `halo` puts a soft accent glow behind the
 * scene (used for the anchor scene on each side). See globals.css.
 */
function Beat({
  index,
  float,
  halo,
  children,
}: {
  index: number;
  float?: boolean;
  halo?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={float ? "illus-enter illus-float" : "illus-enter"}
      style={{ "--illus-delay": `${index * STAGGER_MS}ms` } as CSSProperties}
    >
      {halo ? (
        <div className="relative isolate flex">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-xl"
          />
          {children}
        </div>
      ) : (
        children
      )}
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
      <Beat index={1} halo>
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
      <Beat index={1} halo>
        <TeachBoardScene />
      </Beat>
      <Beat index={2} float>
        <TrendUpAccent />
      </Beat>
    </div>
  );
}
