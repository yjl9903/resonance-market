export function groupBy<T>(arr: T[], fn: (item: T) => string) {
  const map = new Map<string, T[]>()
  for (const item of arr) {
    const key = fn(item)
    if (map.has(key))
      map.get(key)!.push(item)
    else
      map.set(key, [item])
  }

  return map
}
