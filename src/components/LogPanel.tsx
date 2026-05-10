import type { LogEntry } from "../viewmodel/useMemorySimulator";

interface Props {
  logs: LogEntry[];
}

const kindStyles: Record<LogEntry["kind"], string> = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-blue-400",
};

export default function LogPanel({ logs }: Props) {
  if (logs.length === 0) return null;

  return (
    <div className="bg-surface-card rounded-lg border border-border-subtle overflow-hidden flex flex-col max-h-48">
      <div className="p-2 border-b border-border-subtle bg-surface-container-high">
        <h3 className="font-space-grotesk text-xs uppercase tracking-wider text-text-secondary">
          Event Log
        </h3>
      </div>
      <div className="overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={`font-space-grotesk text-[11px] ${kindStyles[entry.kind]}`}
          >
            <span className="text-text-secondary mr-1">[{entry.kind.toUpperCase()}]</span>
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}
