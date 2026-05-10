import type { Hole } from "../model/types";

interface Props {
  holes: Hole[];
}

export default function HolesTable({ holes }: Props) {
  return (
    <div className="bg-surface-card rounded-lg border border-border-subtle overflow-hidden flex flex-col">
      <div className="p-3 border-b border-border-subtle bg-surface-container-high flex justify-between items-center">
        <h2 className="font-space-grotesk text-lg font-medium text-text-primary">
          Free Partitions (Holes)
        </h2>
        <span className="material-symbols-outlined text-text-secondary text-sm">
          view_list
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-border-subtle font-space-grotesk text-xs text-text-secondary uppercase">
              <th className="p-3 font-medium w-16">ID</th>
              <th className="p-3 font-medium">Start Address</th>
              <th className="p-3 font-medium">Size (K)</th>
            </tr>
          </thead>
          <tbody className="font-inter text-sm text-text-primary">
            {holes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-text-secondary text-center font-space-grotesk text-xs">
                  No free partitions
                </td>
              </tr>
            )}
            {holes.map((h, i) => (
              <tr
                key={`${h.start}-${h.size}`}
                className="border-b border-border-subtle hover:bg-surface-container transition-colors"
              >
                <td className="p-3 font-space-grotesk text-text-secondary">H{i}</td>
                <td className="p-3 font-space-grotesk">{h.start}</td>
                <td className="p-3 font-space-grotesk">{h.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
