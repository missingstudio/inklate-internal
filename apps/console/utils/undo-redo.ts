import { Edge, Node } from "@xyflow/react";

type NodeUndoEntry =
  | { type: "add"; nodeId: string }
  | { type: "remove"; node: Node }
  | { type: "update"; node: Node };
type EdgeUndoEntry = { type: "add"; edgeId: string } | { type: "remove"; edge: Edge };

type Change = { type: "edge"; entry: EdgeUndoEntry } | { type: "node"; entry: NodeUndoEntry };

export class UndoRedo {
  private undoStack: UndoRedoEntry[] = [];
  private redoStack: UndoRedoEntry[] = [];
  private undoLimit: number | undefined;

  constructor(undoLimit?: number) {
    this.undoLimit = undoLimit;
  }

  undo(): UndoRedoEntry | undefined {
    if (this.undoLimit && this.undoLimit === this.undoStack.length) return;
    return this.undoStack.pop();
  }

  redo(): UndoRedoEntry | undefined {
    return this.redoStack.pop();
  }

  pushEntry(entry: UndoRedoEntry) {
    if (entry.isEmpty()) {
      return;
    }

    this.undoStack.push(entry);
    this.redoStack = [];
    while (this.undoStack.length > 100) {
      this.undoStack.shift();
    }
  }

  setUndoBarrier() {
    this.undoLimit = this.undoStack.length;
  }

  disableBarrier() {
    this.undoLimit = undefined;
  }

  pushRedo(entry: UndoRedoEntry) {
    this.redoStack.push(entry);
  }

  pushUndo(entry: UndoRedoEntry) {
    this.undoStack.push(entry);
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  hasUndo() {
    return this.undoLimit === undefined
      ? this.undoStack.length > 0
      : this.undoStack.length > this.undoLimit;
  }

  hasRedo() {
    return this.redoStack.length > 0;
  }
}

export class UndoRedoEntry {
  changes?: Change[];

  private constructor(changes?: Change[]) {
    this.changes = changes;
  }

  static empty(): UndoRedoEntry {
    return new UndoRedoEntry();
  }

  static fromEdges(entries: EdgeUndoEntry[]) {
    return new UndoRedoEntry(entries.map((entry) => ({ type: "edge", entry })));
  }

  static fromNodes(entries: NodeUndoEntry[]) {
    return new UndoRedoEntry(entries.map((entry) => ({ type: "node", entry })));
  }

  isEmpty() {
    return !this.changes || this.changes.length === 0;
  }

  add(other: UndoRedoEntry) {
    this.changes = [...(this.changes ?? []), ...(other.changes ?? [])];
  }
}
