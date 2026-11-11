export class HttpError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail);
  }
}

export const round = (value: number, digits = 0): number => {
  const f = 10 ** digits;
  return Math.round((Number(value) || 0) * f) / f;
};

export function num(value: unknown, fallback: number): number {
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  return value !== null && value !== undefined && value !== "" && Number.isFinite(n) ? n : fallback;
}

export function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.length > 0) : [];
}

export function parseJsonList(value: string | undefined, fallback: string[] = []): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return fallback;
  }
}

export const titleCase = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

export const todayIso = () => new Date().toISOString().slice(0, 10);
