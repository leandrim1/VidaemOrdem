type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[] | Record<string, boolean | undefined>

/** Junta classes condicionalmente (versão enxuta de `clsx`). */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []
  for (const value of values) {
    if (!value || value === true) continue
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      out.push(String(value))
    } else if (Array.isArray(value)) {
      const nested = cn(...value)
      if (nested) out.push(nested)
    } else {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) out.push(key)
      }
    }
  }
  return out.join(' ')
}
