/**
 * A bounded cache with optional TTL and max-size eviction.
 * Evicts the oldest entry (by insertion order) when maxSize is exceeded.
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiresAt: number | null }>();
  private maxSize: number;
  private defaultTtlMs: number | undefined;
  private sweepTimer: ReturnType<typeof setInterval> | null = null;

  constructor(opts: {
    maxSize: number;
    ttlMs?: number;
    sweepIntervalMs?: number;
  }) {
    this.maxSize = opts.maxSize;
    this.defaultTtlMs = opts.ttlMs;
    if (opts.sweepIntervalMs) {
      this.sweepTimer = setInterval(() => this.sweep(), opts.sweepIntervalMs);
      if (
        this.sweepTimer &&
        typeof this.sweepTimer === "object" &&
        "unref" in this.sweepTimer
      ) {
        this.sweepTimer.unref();
      }
    }
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    this.cache.delete(key);

    const ttl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiresAt });

    while (this.cache.size > this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  dispose(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
  }
}
