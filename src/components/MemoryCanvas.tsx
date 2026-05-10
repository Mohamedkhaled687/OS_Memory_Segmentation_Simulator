import type { MemoryBlock } from "../model/types";

const PROCESS_COLORS: Record<number, { bg: string; border: string }> = {
  0: { bg: "bg-process-1", border: "border-[#0d47a1]" },
  1: { bg: "bg-process-2", border: "border-[#1b5e20]" },
  2: { bg: "bg-process-3", border: "border-[#6a1b9a]" },
  3: { bg: "bg-process-4", border: "border-[#e65100]" },
  4: { bg: "bg-process-5", border: "border-[#b71c1c]" },
  5: { bg: "bg-process-6", border: "border-[#00838f]" },
  6: { bg: "bg-process-7", border: "border-[#880e4f]" },
  7: { bg: "bg-process-8", border: "border-[#558b2f]" },
};

interface Props {
  memoryMap: MemoryBlock[];
  totalMemory: number;
  processNames: string[];
}

export default function MemoryCanvas({ memoryMap, totalMemory, processNames }: Props) {
  const utilized = memoryMap
    .filter((b) => b.kind === "segment")
    .reduce((acc, b) => acc + b.size, 0);

  const addressMarkers: number[] = [];
  if (totalMemory > 0) {
    const step = Math.max(1, Math.round(totalMemory / 5));
    for (let a = 0; a <= totalMemory; a += step) {
      addressMarkers.push(a);
    }
    if (addressMarkers[addressMarkers.length - 1] !== totalMemory) {
      addressMarkers.push(totalMemory);
    }
  }

  const getColor = (processName: string) => {
    const idx = processNames.indexOf(processName);
    return PROCESS_COLORS[idx % 8] ?? PROCESS_COLORS[0];
  };

  const minBlockPx = 32;

  return (
    <section className="w-full bg-surface-card rounded-lg border border-border-subtle p-container-padding flex flex-col h-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
        <h2 className="font-space-grotesk text-lg font-medium text-text-primary">
          Memory Layout 
        </h2>
        <span className="font-space-grotesk text-xs text-primary border border-primary px-2 py-1 rounded bg-primary/10">
          {utilized} / {totalMemory} UTILIZED
        </span>
      </div>

      <div className="relative flex-1 bg-surface-container-lowest border border-border-subtle rounded overflow-y-auto custom-scrollbar flex">
        {/* Address axis */}
        <div className="w-16 border-r border-border-subtle bg-surface-container flex flex-col justify-between py-2 items-end pr-2 font-space-grotesk text-[10px] text-text-secondary sticky left-0 z-10">
          {addressMarkers.map((addr) => (
            <span key={addr} className={addr === 0 ? "text-primary" : ""}>
              {addr}
            </span>
          ))}
        </div>

        {/* Blocks */}
        <div className="flex-1 relative flex flex-col p-2 gap-0.5 bg-[#151515]">
          {memoryMap.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-text-secondary font-space-grotesk text-xs uppercase tracking-widest">
              Initialize memory to begin
            </div>
          )}

          {memoryMap.map((block, i) => {
            const heightPercent = (block.size / totalMemory) * 100;
            const style = {
              minHeight: `${minBlockPx}px`,
              flexGrow: heightPercent,
              flexShrink: 1,
              flexBasis: 0,
            };

            if (block.kind === "hole") {
              return (
                <div
                  key={`${block.start}-${i}`}
                  className="w-full bg-surface-container-low border border-dashed border-border-subtle rounded flex items-center justify-center relative group"
                  style={style}
                >
                  <span className="font-space-grotesk text-xs text-text-secondary z-10">
                    Hole ({block.size}K)
                  </span>
                  <div className="absolute inset-0 hole-pattern" />
                  <Tooltip
                    lines={[
                      `FREE SPACE`,
                      `Start: ${block.start}`,
                      `Size: ${block.size}K`,
                    ]}
                  />
                </div>
              );
            }

            if (block.kind === "segment") {
              const color = getColor(block.processName);
              return (
                <div
                  key={`${block.start}-${i}`}
                  className={`w-full ${color.bg} rounded flex items-center justify-center border ${color.border} relative group`}
                  style={style}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-white/30" />
                  <span className="font-space-grotesk text-xs text-text-primary drop-shadow-md z-10">
                    {block.processName} : {block.segmentName}
                  </span>
                  <Tooltip
                    lines={[
                      `${block.processName} : ${block.segmentName}`,
                      `Start: ${block.start}`,
                      `Size: ${block.size}K`,
                    ]}
                  />
                </div>
              );
            }

            // occupied
            return (
              <div
                key={`${block.start}-${i}`}
                className="w-full bg-zinc-800/60 rounded flex items-center justify-center border border-zinc-700 relative group"
                style={style}
              >
                <span className="font-space-grotesk text-[10px] text-zinc-500 z-10">
                  SYSTEM ({block.size}K)
                </span>
                <Tooltip
                  lines={[
                    `OCCUPIED / SYSTEM`,
                    `Start: ${block.start}`,
                    `Size: ${block.size}K`,
                  ]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Tooltip({ lines }: { lines: string[] }) {
  return (
    <div className="absolute hidden group-hover:flex bg-surface-container-high border border-border-subtle p-2 rounded z-20 left-full ml-2 whitespace-nowrap font-space-grotesk text-[10px] flex-col gap-1 shadow-lg pointer-events-none">
      {lines.map((l, i) => (
        <span key={i} className={i === 0 ? "text-primary font-bold" : "text-text-secondary"}>
          {l}
        </span>
      ))}
    </div>
  );
}
