import { useCallback, useRef, useState } from "react";
import { MemoryManager } from "../model/MemoryManager";
import type {
  AllocationStrategy,
  Hole,
  MemoryBlock,
  Process,
} from "../model/types";

// ─── Types exposed to the View ───

export interface LogEntry {
  id: number;
  kind: "success" | "error" | "info";
  text: string;
}

export interface SimulatorState {
  initialized: boolean;
  totalMemory: number;
  holes: Hole[];
  processes: Process[];
  memoryMap: MemoryBlock[];
  logs: LogEntry[];
}

export interface SimulatorActions {
  initialize: (totalMemory: number, holes: Hole[]) => void;
  allocate: (
    processName: string,
    segments: { name: string; size: number }[],
    strategy: AllocationStrategy
  ) => void;
  deallocate: (processName: string) => void;
  reset: () => void;
}

const EMPTY_STATE: SimulatorState = {
  initialized: false,
  totalMemory: 0,
  holes: [],
  processes: [],
  memoryMap: [],
  logs: [],
};

/**
 * useMemorySimulator – the ViewModel hook.
 *
 * It owns a MemoryManager instance (the Model) via useRef,
 * and exposes a reactive SimulatorState + SimulatorActions
 * to any React component that calls this hook.
 *
 * WHY a hook instead of a class-based controller?
 * ─────────────────────────────────────────────────
 * React hooks let us co-locate state (useState) and side-effect
 * logic in a single reusable function.  When the hook calls
 * setState, React automatically re-renders every component that
 * consumes this hook's return value — no manual "observer" wiring.
 */
export function useMemorySimulator(): [SimulatorState, SimulatorActions] {
  const [state, setState] = useState<SimulatorState>(EMPTY_STATE);

  // useRef keeps the same MemoryManager across re-renders
  // without triggering re-renders itself.
  const managerRef = useRef<MemoryManager | null>(null);
  const logIdRef = useRef(0);

  const addLog = useCallback(
    (kind: LogEntry["kind"], text: string) => {
      const entry: LogEntry = { id: ++logIdRef.current, kind, text };
      setState((prev) => ({ ...prev, logs: [entry, ...prev.logs].slice(0, 50) }));
    },
    []
  );

  const snapshot = useCallback((): Partial<SimulatorState> => {
    const mgr = managerRef.current;
    if (!mgr) return {};
    return {
      holes: mgr.holes,
      processes: mgr.processes,
      memoryMap: mgr.buildMemoryMap(),
    };
  }, []);

  // ─── Actions ───

  const initialize = useCallback(
    (totalMemory: number, holes: Hole[]) => {
      const mgr = new MemoryManager(totalMemory, holes);
      managerRef.current = mgr;

      setState({
        initialized: true,
        totalMemory,
        holes: mgr.holes,
        processes: [],
        memoryMap: mgr.buildMemoryMap(),
        logs: [],
      });
      logIdRef.current = 0;
      addLog("info", `Memory initialized: ${totalMemory}K total, ${holes.length} hole(s).`);
    },
    [addLog]
  );

  const allocate = useCallback(
    (
      processName: string,
      segments: { name: string; size: number }[],
      strategy: AllocationStrategy
    ) => {
      const mgr = managerRef.current;
      if (!mgr) return;

      const result = mgr.allocate(processName, segments, strategy);
      setState((prev) => ({
        ...prev,
        ...snapshot(),
      }));

      addLog(result.success ? "success" : "error", result.message);
    },
    [addLog, snapshot]
  );

  const deallocate = useCallback(
    (processName: string) => {
      const mgr = managerRef.current;
      if (!mgr) return;

      const result = mgr.deallocate(processName);
      setState((prev) => ({
        ...prev,
        ...snapshot(),
      }));

      addLog(result.success ? "success" : "error", result.message);
    },
    [addLog, snapshot]
  );

  const reset = useCallback(() => {
    managerRef.current = null;
    setState(EMPTY_STATE);
  }, []);

  return [state, { initialize, allocate, deallocate, reset }];
}
