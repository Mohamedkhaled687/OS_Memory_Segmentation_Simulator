// ─── Core Domain Types ───
// These interfaces model the OS memory segmentation concepts.
// They are pure data — no React, no UI, no side effects.

export type AllocationStrategy = "first-fit" | "best-fit";

export interface Hole {
  start: number;
  size: number;
}

export interface Segment {
  name: string;
  size: number;
  base: number; // starting address once allocated
}

export interface Process {
  name: string;
  segments: Segment[];
}

/**
 * A MemoryBlock represents one contiguous region in the memory layout.
 * - "hole": free space available for allocation
 * - "segment": space occupied by a process segment
 * - "occupied": space that is neither a hole nor allocated by us
 *   (e.g. OS kernel, gaps between user-defined holes)
 */
export type MemoryBlock =
  | { kind: "hole"; start: number; size: number }
  | {
      kind: "segment";
      start: number;
      size: number;
      processName: string;
      segmentName: string;
    }
  | { kind: "occupied"; start: number; size: number };

export interface MemoryState {
  totalMemory: number;
  holes: Hole[];
  processes: Process[];
  memoryMap: MemoryBlock[];
}

export interface AllocationResult {
  success: boolean;
  message: string;
}
