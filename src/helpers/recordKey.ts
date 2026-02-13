import type { DatabaseKey } from "../services/types";

export function hasId(obj: unknown): obj is { id: unknown } {
  return typeof obj === "object" && obj != null && "id" in obj;
}

export function getRecordKeyFromValue<T>(value: T, key?: DatabaseKey): string {
  const id = hasId(value) ? value.id : key;
  return String(id);
}
