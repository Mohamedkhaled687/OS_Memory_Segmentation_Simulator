import { useState } from "react";
import type { AllocationStrategy } from "../model/types";

interface SegmentInput {
  name: string;
  size: number;
}

interface Props {
  onAllocate: (
    processName: string,
    segments: SegmentInput[],
    strategy: AllocationStrategy
  ) => void;
  disabled: boolean;
}

export default function AllocationPanel({ onAllocate, disabled }: Props) {
  const [processName, setProcessName] = useState("");
  const [numSegments, setNumSegments] = useState(3);
  const [segments, setSegments] = useState<SegmentInput[]>([
    { name: "Code", size: 100 },
    { name: "Data", size: 120 },
    { name: "Stack", size: 90 },
  ]);
  const [strategy, setStrategy] = useState<AllocationStrategy>("first-fit");

  const handleNumChange = (val: number) => {
    const n = Math.max(1, Math.min(10, val));
    setNumSegments(n);
    setSegments((prev) => {
      if (n > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: n - prev.length }, (_, i) => ({
            name: `Seg${prev.length + i + 1}`,
            size: 50,
          })),
        ];
      }
      return prev.slice(0, n);
    });
  };

  const updateSegment = (idx: number, field: "name" | "size", value: string) => {
    setSegments((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, [field]: field === "size" ? Number(value) || 0 : value }
          : s
      )
    );
  };

  const handleAllocate = () => {
    if (!processName.trim()) return;
    if (segments.some((s) => s.size <= 0 || !s.name.trim())) return;
    onAllocate(processName.trim(), segments, strategy);
    setProcessName("");
  };

  return (
    <div className="bg-surface-card rounded-lg border border-border-subtle p-card-gap flex flex-col gap-card-gap">
      <h2 className="font-space-grotesk text-lg font-medium text-text-primary border-b border-border-subtle pb-2">
        Process Allocation
      </h2>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
              Process Name
            </label>
            <input
              type="text"
              placeholder="e.g. P1"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              disabled={disabled}
              className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
              Num Segments
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={numSegments}
              onChange={(e) => handleNumChange(Number(e.target.value))}
              disabled={disabled}
              className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs disabled:opacity-50"
            />
          </div>
        </div>

        {/* Segments inputs */}
        <div className="flex flex-col gap-2 border border-border-subtle rounded p-3 bg-surface-container-lowest">
          <h3 className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary mb-1">
            Segments Configuration
          </h3>
          <div className="grid grid-cols-12 gap-2 items-center mb-1">
            <div className="col-span-5 font-space-grotesk text-[10px] text-text-secondary uppercase">
              Name
            </div>
            <div className="col-span-7 font-space-grotesk text-[10px] text-text-secondary uppercase">
              Size (K)
            </div>
          </div>
          {segments.map((seg, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={seg.name}
                onChange={(e) => updateSegment(i, "name", e.target.value)}
                disabled={disabled}
                className="col-span-5 bg-surface-container-low border border-border-subtle rounded text-text-primary px-2 py-1 focus:border-primary outline-none font-space-grotesk text-xs disabled:opacity-50"
              />
              <input
                type="number"
                min={1}
                value={seg.size}
                onChange={(e) => updateSegment(i, "size", e.target.value)}
                disabled={disabled}
                className="col-span-7 bg-surface-container-low border border-border-subtle rounded text-text-primary px-2 py-1 focus:border-primary outline-none font-space-grotesk text-xs disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Strategy selector */}
        <div className="flex flex-col gap-1 mt-1">
          <label className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
            Allocation Method
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as AllocationStrategy)}
            disabled={disabled}
            className="bg-surface-container-low border border-border-subtle rounded text-text-primary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-space-grotesk text-xs appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="first-fit">First Fit</option>
            <option value="best-fit">Best Fit</option>
          </select>
        </div>

        <button
          onClick={handleAllocate}
          disabled={disabled || !processName.trim()}
          className="bg-primary text-on-primary font-space-grotesk text-base font-medium uppercase py-3 rounded hover:brightness-110 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Allocate Process
        </button>
      </div>
    </div>
  );
}
