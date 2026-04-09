export function parseGallery(json: string): string[] {
  try {
    const v = JSON.parse(json) as unknown;
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function stringifyGallery(urls: string[]): string {
  return JSON.stringify(urls);
}
