import { useState } from "react";
import type { Hole } from "../model/types";

interface Props {
  onInitialize: (totalMemory: number, holes: Hole[]) => void;
  initialized: boolean;
}

export default function InitializationPanel({ onInitialize, initialized }: Props) {
  const [totalMemory, setTotalMemory] = useState(1000);
  const [holeStart, setHoleStart] = useState<number | "">("");
  const [holeSize, setHoleSize] = useState<number | "">("");
  const [holes, setHoles] = useState<Hole[]>([]);

  const addHole = () => {
    if (holeStart === "" || holeSize === "" || holeSize <= 0) return;
    setHoles((prev) => [...prev, { start: Number(holeStart), size: Number(holeSize) }]);
    setHoleStart("");
    setHoleSize("");
  };

  const removeHole = (idx: number) => {
    setHoles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleInit = () => {
    if (totalMemory <= 0) return;
    onInitialize(totalMemory, holes);
  };

  return (
    <div className="bg-surface-card rounded-lg border border-border-subtle p-card-gap flex flex-col gap-card-gap">
      <h2 className="font-space-grotesk text-lg font-medium text-text-primary border-b border-border-subtle pb-2">
        System Initialization
      </h2>

      <div className="flex flex-col gap-3">
        {/* Total Memory */}
        <div className="flex flex-col gap-1">
          <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
            Total Memory Size (K)
          </label>
          <input
            type="number"
            min={1}
            value={totalMemory}
            onChange={(e) => setTotalMemory(Number(e.target.value))}
            disabled={initialized}
            className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 w-full focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs disabled:opacity-50"
          />
        </div>

        {/* Add Hole */}
        <div className="flex flex-col gap-1 border-t border-border-subtle pt-3 mt-1">
          <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
            Add Initial Hole
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              placeholder="Start Addr"
              value={holeStart}
              onChange={(e) =>
                setHoleStart(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={initialized}
              className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs disabled:opacity-50"
            />
            <input
              type="number"
              min={1}
              placeholder="Size"
              value={holeSize}
              onChange={(e) =>
                setHoleSize(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={initialized}
              className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs disabled:opacity-50"
            />
          </div>
          <button
            onClick={addHole}
            disabled={initialized}
            className="mt-2 bg-surface-container border border-border-subtle hover:bg-surface-bright text-text-primary font-space-grotesk text-xs uppercase py-2 px-4 rounded transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add Hole
          </button>
        </div>

        {/* Hole list */}
        {holes.length > 0 && (
          <div className="flex flex-col gap-1">
            {holes.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-surface-container-lowest border border-border-subtle rounded px-3 py-1.5 font-space-grotesk text-xs"
              >
                <span className="text-text-secondary">
                  H{i + 1}: Start={h.start}, Size={h.size}
                </span>
                {!initialized && (
                  <button
                    onClick={() => removeHole(i)}
                    className="text-status-error hover:text-red-400 ml-2"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Initialize button */}
        <button
          onClick={handleInit}
          disabled={initialized}
          className="bg-primary text-on-primary font-space-grotesk text-base font-medium uppercase py-3 rounded hover:brightness-110 transition-all mt-2 disabled:opacity-50"
        >
          {initialized ? "System Initialized" : "Initialize Memory"}
        </button>
      </div>
    </div>
  );
}
