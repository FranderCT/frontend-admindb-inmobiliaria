import { AgentPreview } from "@/modules/contratos/models/contract";

export function uniqById(arr: AgentPreview[]) {
  const map = new Map<number, AgentPreview>();
  for (const it of arr) {
    if (typeof it?.identificacion === "number" && !map.has(it.identificacion)) {
      map.set(it.identificacion, it);
    }
  }
  return Array.from(map.values());
}
