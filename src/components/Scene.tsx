import type { CSSProperties } from "react";
import type { Trip } from "../catalog";

/** Ilustración del destino: cielo en degradé, montañas y sol. */
export function Scene({ trip }: { trip: Trip }) {
  const [mountains, middle, top] = trip.scene;
  return (
    <div className="scene" style={{ "--c1": mountains, "--c2": middle, "--c3": top } as CSSProperties}>
      <svg className="scene-mountains" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 L0 70 L60 30 L110 75 L170 15 L240 80 L300 40 L360 85 L400 55 L400 120 Z" />
      </svg>
      <span className="scene-sun" aria-hidden="true" />
    </div>
  );
}
