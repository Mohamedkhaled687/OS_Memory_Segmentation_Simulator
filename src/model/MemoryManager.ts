import type {
  Hole,
  Segment,
  Process,
  MemoryBlock,
  AllocationStrategy,
  AllocationResult,
} from "./types";

/**
 * MemoryManager is a pure-logic class with zero React dependencies.
 * It owns the two canonical tables from the assignment:
 *   1. holes[]   – free partitions table
 *   2. processes[] – allocated partitions (segment tables per process)
 *
 * Every public method returns NEW arrays/objects (immutable style)
 * so React can detect changes via reference comparison.
 */
export class MemoryManager {
  readonly totalMemory: number;
  private _holes: Hole[];
  private _processes: Process[];

  constructor(totalMemory: number, initialHoles: Hole[]) {
    this.totalMemory = totalMemory;
    this._holes = [...initialHoles].sort((a, b) => a.start - b.start);
    this._processes = [];
  }

  // ─── Read-only accessors ───

  get holes(): Hole[] {
    return this._holes.map((h) => ({ ...h }));
  }

  get processes(): Process[] {
    return this._processes.map((p) => ({
      name: p.name,
      segments: p.segments.map((s) => ({ ...s })),
    }));
  }

  // ─── Allocation ───

  allocate(
    processName: string,
    segmentDefs: { name: string; size: number }[],
    strategy: AllocationStrategy
  ): AllocationResult {
    if (this._processes.some((p) => p.name === processName)) {
      return { success: false, message: `Process "${processName}" already exists.` };
    }

    // Work on a copy of holes so we can roll back on failure
    let workingHoles = this._holes.map((h) => ({ ...h }));
    const allocatedSegments: Segment[] = [];

    for (const seg of segmentDefs) {
      const holeIndex = this.findHole(workingHoles, seg.size, strategy);
      if (holeIndex === -1) {
        return {
          success: false,
          message:
            `Process "${processName}" does not fit. ` +
            `Segment "${seg.name}" (size ${seg.size}) cannot be placed in any available hole.`,
        };
      }

      const hole = workingHoles[holeIndex];
      allocatedSegments.push({ name: seg.name, size: seg.size, base: hole.start });

      if (hole.size === seg.size) {
        workingHoles.splice(holeIndex, 1);
      } else {
        workingHoles[holeIndex] = {
          start: hole.start + seg.size,
          size: hole.size - seg.size,
        };
      }
    }

    // Commit: all segments placed successfully
    this._holes = workingHoles;
    this._processes.push({ name: processName, segments: allocatedSegments });

    return {
      success: true,
      message: `Process "${processName}" allocated successfully (${allocatedSegments.length} segments).`,
    };
  }

  // ─── Deallocation with coalescing ───

  deallocate(processName: string): AllocationResult {
    const idx = this._processes.findIndex((p) => p.name === processName);
    if (idx === -1) {
      return { success: false, message: `Process "${processName}" not found.` };
    }

    const process = this._processes[idx];

    // Return every segment as a hole
    for (const seg of process.segments) {
      this._holes.push({ start: seg.base, size: seg.size });
    }

    this._processes.splice(idx, 1);

    // Sort holes by start address then coalesce adjacent ones
    this._holes.sort((a, b) => a.start - b.start);
    this.coalesce();

    return {
      success: true,
      message: `Process "${processName}" deallocated. ${process.segments.length} segment(s) freed and coalesced.`,
    };
  }

  // ─── Memory map for visualization ───

  buildMemoryMap(): MemoryBlock[] {
    const blocks: MemoryBlock[] = [];

    // Gather every known region
    for (const h of this._holes) {
      blocks.push({ kind: "hole", start: h.start, size: h.size });
    }
    for (const p of this._processes) {
      for (const s of p.segments) {
        blocks.push({
          kind: "segment",
          start: s.base,
          size: s.size,
          processName: p.name,
          segmentName: s.name,
        });
      }
    }

    blocks.sort((a, b) => a.start - b.start);

    // Fill gaps with "occupied" blocks
    const filled: MemoryBlock[] = [];
    let cursor = 0;

    for (const block of blocks) {
      if (block.start > cursor) {
        filled.push({ kind: "occupied", start: cursor, size: block.start - cursor });
      }
      filled.push(block);
      cursor = block.start + block.size;
    }

    if (cursor < this.totalMemory) {
      filled.push({ kind: "occupied", start: cursor, size: this.totalMemory - cursor });
    }

    return filled;
  }

  // ─── Private helpers ───

  /**
   * First-Fit: scan holes from lowest address, return the first one >= size.
   * Best-Fit:  scan ALL holes, return the smallest one that is >= size.
   */
  private findHole(holes: Hole[], size: number, strategy: AllocationStrategy): number {
    if (strategy === "first-fit") {
      return holes.findIndex((h) => h.size >= size);
    }

    // best-fit
    let bestIdx = -1;
    let bestSize = Infinity;
    for (let i = 0; i < holes.length; i++) {
      if (holes[i].size >= size && holes[i].size < bestSize) {
        bestSize = holes[i].size;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  /**
   * Merge adjacent holes.  Two holes are "adjacent" when
   * hole[i].start + hole[i].size === hole[i+1].start.
   */
  private coalesce(): void {
    if (this._holes.length <= 1) return;

    const merged: Hole[] = [this._holes[0]];
    for (let i = 1; i < this._holes.length; i++) {
      const prev = merged[merged.length - 1];
      const curr = this._holes[i];

      if (prev.start + prev.size === curr.start) {
        prev.size += curr.size; // absorb into previous
      } else {
        merged.push(curr);
      }
    }
    this._holes = merged;
  }
}
