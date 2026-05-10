import { useRef, useState } from "react";
import { useMemorySimulator } from "./viewmodel/useMemorySimulator";
import TopAppBar from "./components/TopAppBar";
import Sidebar from "./components/Sidebar";
import InitializationPanel from "./components/InitializationPanel";
import AllocationPanel from "./components/AllocationPanel";
import DeallocationPanel from "./components/DeallocationPanel";
import MemoryCanvas from "./components/MemoryCanvas";
import HolesTable from "./components/HolesTable";
import ProcessTable from "./components/ProcessTable";
import LogPanel from "./components/LogPanel";

type Panel = "init" | "allocate" | "deallocate";

/**
 * We keep a running list of process names (even deallocated ones)
 * so each process always gets the same color index.
 */
export default function App() {
  const [state, actions] = useMemorySimulator();
  const [activePanel, setActivePanel] = useState<Panel>("init");
  const allProcessNamesRef = useRef<string[]>([]);

  // Track every process name we've ever seen for stable color assignment
  for (const p of state.processes) {
    if (!allProcessNamesRef.current.includes(p.name)) {
      allProcessNamesRef.current.push(p.name);
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-inter text-sm">
      <TopAppBar initialized={state.initialized} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={activePanel} onSelect={setActivePanel} />

        <main className="flex-1 flex w-full h-full overflow-hidden bg-surface-main p-container-padding gap-container-padding">
          {/* Left pane: Controls (30%) */}
          <section className="w-[30%] flex flex-col gap-container-padding overflow-y-auto custom-scrollbar pr-2 h-full">
            {activePanel === "init" && (
              <InitializationPanel
                onInitialize={actions.initialize}
                initialized={state.initialized}
              />
            )}

            {activePanel === "allocate" && (
              <AllocationPanel
                onAllocate={actions.allocate}
                disabled={!state.initialized}
              />
            )}

            {activePanel === "deallocate" && (
              <DeallocationPanel
                processes={state.processes}
                onDeallocate={actions.deallocate}
                disabled={!state.initialized}
              />
            )}

            {/* Always show log panel at the bottom of the left pane */}
            <LogPanel logs={state.logs} />
          </section>

          {/* Center pane: Memory Canvas (30%) */}
          <section className="w-[30%] flex flex-col h-full">
            <MemoryCanvas
              memoryMap={state.memoryMap}
              totalMemory={state.totalMemory}
              processNames={allProcessNamesRef.current}
            />
          </section>

          {/* Right pane: Data Tables (40%) */}
          <section className="w-[40%] flex flex-col gap-container-padding overflow-y-auto custom-scrollbar h-full pl-2">
            <HolesTable holes={state.holes} />
            <ProcessTable
              processes={state.processes}
              allProcessNames={allProcessNamesRef.current}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
