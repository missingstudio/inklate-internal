export class MapStore<K, V> {
  private map: Map<K, V>;
  private keyListeners: Map<K, Set<() => void>> = new Map();
  private listeners: Set<() => void> = new Set();

  private cachedValuesArray: V[] = [];

  constructor(entries?: [K, V][]) {
    this.map = new Map(entries);
    this.cachedValuesArray = [...this.map.values()];
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  set(key: K, value: V): void {
    this.map.set(key, value);
    this.notifyKey(key);
    this.onChange();
  }

  delete(key: K): void {
    this.map.delete(key);
    this.notifyKey(key);
    this.onChange();
  }

  values() {
    return this.cachedValuesArray;
  }

  keys() {
    return this.map.keys();
  }

  entries() {
    return this.map.entries();
  }

  private notifyKey(key: K) {
    const keyListeners = this.keyListeners.get(key);
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener();
      }
    }
  }

  private onChange() {
    this.cachedValuesArray = [...this.map.values()];
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  addListener(callback: () => void): () => void {
    if (!this.listeners.has(callback)) {
      this.listeners.add(callback);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  addKeyListener(key: K, callback: () => void): () => void {
    if (!this.keyListeners.has(key)) {
      this.keyListeners.set(key, new Set());
    }
    const keyListeners = this.keyListeners.get(key)!;
    keyListeners.add(callback);
    return () => {
      keyListeners.delete(callback);
      if (keyListeners.size === 0) {
        this.keyListeners.delete(key);
      }
    };
  }
}
