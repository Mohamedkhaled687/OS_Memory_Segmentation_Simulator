interface TopAppBarProps {
  initialized: boolean;
}

export default function TopAppBar({ initialized }: TopAppBarProps) {
  return (
    <header className="bg-zinc-950 flex justify-between items-center w-full px-6 py-3 border-b border-zinc-800 z-50 flex-shrink-0">
      <div className="flex items-center gap-3 text-green-500 font-bold tracking-widest text-xl font-space-grotesk uppercase">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          memory
        </span>
        MEM_Manager
      </div>
      <div className="flex items-center gap-4 text-xs tracking-widest font-space-grotesk">
        <span
          className={`font-bold ${initialized ? "text-green-500" : "text-zinc-500"}`}
        >
          {initialized ? "SYSTEM_STABLE" : "AWAITING_INIT"}
        </span>
      </div>
    </header>
  );
}
