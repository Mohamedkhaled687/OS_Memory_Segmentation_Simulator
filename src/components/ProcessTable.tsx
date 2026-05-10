import type { Process } from "../model/types";

const PROCESS_BORDER_COLORS: string[] = [
  "border-l-process-1",
  "border-l-process-2",
  "border-l-process-3",
  "border-l-process-4",
  "border-l-process-5",
  "border-l-process-6",
  "border-l-process-7",
  "border-l-process-8",
];

const PROCESS_TEXT_COLORS: string[] = [
  "text-process-1",
  "text-process-2",
  "text-process-3",
  "text-process-4",
  "text-process-5",
  "text-process-6",
  "text-process-7",
  "text-process-8",
];

const PROCESS_RING_COLORS: string[] = [
  "border-process-1/30",
  "border-process-2/30",
  "border-process-3/30",
  "border-process-4/30",
  "border-process-5/30",
  "border-process-6/30",
  "border-process-7/30",
  "border-process-8/30",
];

interface Props {
  processes: Process[];
  allProcessNames: string[];
}

export default function ProcessTable({ processes, allProcessNames }: Props) {
  if (processes.length === 0) {
    return (
      <div className="bg-surface-card rounded-lg border border-border-subtle p-6 flex items-center justify-center">
        <span className="font-space-grotesk text-xs text-text-secondary uppercase tracking-widest">
          No processes allocated
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {processes.map((proc) => {
        const colorIdx = allProcessNames.indexOf(proc.name) % 8;
        return (
          <div
            key={proc.name}
            className={`bg-surface-card rounded-lg border ${PROCESS_RING_COLORS[colorIdx]} overflow-hidden flex flex-col`}
          >
            <div
              className={`p-2 border-b border-border-subtle bg-surface-container-high flex justify-between items-center border-l-4 ${PROCESS_BORDER_COLORS[colorIdx]}`}
            >
              <h3
                className={`font-space-grotesk text-xs ${PROCESS_TEXT_COLORS[colorIdx]} uppercase font-bold tracking-wider`}
              >
                {proc.name} Segment Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-border-subtle font-space-grotesk text-[10px] text-text-secondary uppercase">
                    <th className="p-2 font-medium">Segment</th>
                    <th className="p-2 font-medium">Size (K)</th>
                    <th className="p-2 font-medium">Base Addr</th>
                  </tr>
                </thead>
                <tbody className="font-inter text-xs text-text-primary">
                  {proc.segments.map((seg) => (
                    <tr
                      key={seg.name}
                      className="border-b border-border-subtle/50 hover:bg-surface-container transition-colors"
                    >
                      <td className="p-2">{seg.name}</td>
                      <td className="p-2 font-space-grotesk">{seg.size}</td>
                      <td className="p-2 font-space-grotesk text-primary">{seg.base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
