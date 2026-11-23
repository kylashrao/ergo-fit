import type { ReactNode } from "react";

export default function AdSlot({ enabled = false, children }: { enabled?: boolean; children?: ReactNode }) {
  if (!enabled) return null;

  return (
    <aside aria-label="Advertisement" className="ad-slot">
      {children}
    </aside>
  );
}
