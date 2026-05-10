type Panel = "init" | "allocate" | "deallocate";

interface SidebarProps {
  active: Panel;
  onSelect: (panel: Panel) => void;
}

const items: { id: Panel; label: string; icon: string }[] = [
  { id: "init", label: "Initialization", icon: "settings_input_component" },
  { id: "allocate", label: "Allocation", icon: "add_box" },
  { id: "deallocate", label: "Deallocation", icon: "indeterminate_check_box" },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="bg-zinc-950 border-r border-zinc-800 w-64 flex flex-col overflow-y-auto flex-shrink-0 z-40 custom-scrollbar">
      <div className="p-6 pb-2">
        <h2 className="font-space-grotesk text-xs uppercase tracking-widest text-green-600 mb-4">
          CONTROLS
        </h2>
      </div>
      <nav className="flex flex-col gap-1 px-2 font-space-grotesk text-xs uppercase tracking-widest">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`py-4 px-6 flex items-center gap-3 rounded transition-colors duration-150 text-left ${
                isActive
                  ? "bg-zinc-900 text-green-400 border-r-4 border-green-600 opacity-80"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
