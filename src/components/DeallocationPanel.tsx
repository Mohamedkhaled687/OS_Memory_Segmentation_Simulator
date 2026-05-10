import { useState, useEffect } from "react";
import type { Process } from "../model/types";

interface Props {
  processes: Process[];
  onDeallocate: (processName: string) => void;
  disabled: boolean;
}

export default function DeallocationPanel({
  processes,
  onDeallocate,
  disabled,
}: Props) {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (processes.length > 0 && !processes.some((p) => p.name === selected)) {
      setSelected(processes[0].name);
    }
    if (processes.length === 0) {
      setSelected("");
    }
  }, [processes, selected]);

  return (
    <div className="bg-surface-card rounded-lg border border-border-subtle p-card-gap flex flex-col gap-card-gap">
      <h2 className="font-space-grotesk text-lg font-medium text-text-primary border-b border-border-subtle pb-2">
        Deallocation
      </h2>

      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
            Select Process
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={disabled || processes.length === 0}
            className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-status-error focus:ring-1 focus:ring-status-error outline-none transition-colors font-space-grotesk text-xs appearance-none cursor-pointer disabled:opacity-50"
          >
            {processes.length === 0 && <option value="">No processes</option>}
            {processes.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.segments.length} Segment{p.segments.length !== 1 ? "s" : ""})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            if (selected) onDeallocate(selected);
          }}
          disabled={disabled || !selected}
          className="bg-status-error text-text-primary font-space-grotesk text-xs uppercase py-2 px-4 rounded hover:opacity-90 transition-opacity h-[38px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deallocate
        </button>
      </div>
    </div>
  );
}
