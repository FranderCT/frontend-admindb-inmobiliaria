/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/extractServerErrors.ts
type ServerErrorShape =
  | {
    message?: string | string[] | { [k: string]: any }[]; 
    error?: string;
    statusCode?: number;
    errors?: Array<{ field?: string; message: string }>;
    fieldErrors?: Record<string, string>;
    code?: string | number;
    number?: number; 
    [k: string]: any;
  }
  | string
  | ArrayBuffer
  | Blob
  | null
  | undefined;

function decodeArrayBuffer(buf: ArrayBuffer | Uint8Array) {
  try {
    return new TextDecoder("utf-8").decode(buf as ArrayBuffer);
  } catch {
    return "";
  }
}

function pickFirstText(...vals: Array<unknown>) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export function extractServerErrors(err: any): {
  formError?: string;
  fieldErrors: Record<string, string>;
} {
  const fallbackMsg = "Ocurrió un error al procesar la solicitud.";
  const fieldErrors: Record<string, string> = {};

  const status = err?.response?.status as number | undefined;
  const statusText = err?.response?.statusText as string | undefined;
  const headers = err?.response?.headers as Record<string, string> | undefined;
  let data: ServerErrorShape = err?.response?.data as ServerErrorShape;

  const axiosCode = err?.code as string | undefined;
  if (!err?.response) {
    const msg =
      axiosCode === "ERR_NETWORK"
        ? "No se pudo conectar con el servidor (posible CORS o desconexión)."
        : axiosCode === "ECONNABORTED"
          ? "La solicitud excedió el tiempo de espera."
          : pickFirstText(err?.message, fallbackMsg) ?? fallbackMsg;

    return { formError: msg, fieldErrors };
  }

  if (typeof data === "string") {
    const clean = data.trim();
    if (clean) return { formError: clean, fieldErrors };
  }

  if (data instanceof ArrayBuffer || (typeof ArrayBuffer !== "undefined" && data?.byteLength)) {
    const text = decodeArrayBuffer(data as ArrayBuffer);
    if (text?.trim()) return { formError: text.trim(), fieldErrors };
  }

  if (typeof Blob !== "undefined" && data instanceof Blob) {
    const ct = headers?.["content-type"] || headers?.["Content-Type"];
    const hint =
      ct?.includes("text/") || ct?.includes("json")
        ? "El servidor devolvió un cuerpo no parseable (Blob)."
        : undefined;
    return { formError: pickFirstText(statusText, hint, fallbackMsg) ?? fallbackMsg, fieldErrors };
  }

  if (!data || typeof data !== "object") {
    if (status === 413) return { formError: "El archivo es demasiado grande (413).", fieldErrors };
    if (status === 415) return { formError: "Tipo de contenido no soportado (415).", fieldErrors };
    if (status === 404) return { formError: "Recurso no encontrado (404).", fieldErrors };
    if (status === 405) return { formError: "Método no permitido (405).", fieldErrors };

    return { formError: pickFirstText(statusText, fallbackMsg) ?? fallbackMsg, fieldErrors };
  }

  const obj = data as Exclude<ServerErrorShape, string | ArrayBuffer | Blob | null | undefined>;

  if ("fieldErrors" in obj && obj.fieldErrors && typeof obj.fieldErrors === "object") {
    const msg = Array.isArray(obj.message)
      ? obj.message.join(" | ")
      : pickFirstText(obj.message as string, obj.error as string, statusText, fallbackMsg);
    return { formError: msg, fieldErrors: obj.fieldErrors as Record<string, string> };
  }

  if (Array.isArray(obj.errors)) {
    for (const e of obj.errors) {
      if (e?.field) fieldErrors[e.field] = e.message;
    }
    const msg = Array.isArray(obj.message)
      ? obj.message.join(" | ")
      : pickFirstText(obj.message as string, obj.error as string, statusText, fallbackMsg);
    return { formError: msg, fieldErrors };
  }

  if (Array.isArray(obj.message)) {
    const msgs: string[] = [];
    for (const m of obj.message) {
      if (typeof m === "string") {
        msgs.push(m);
        const match = m.match(/^([a-zA-Z0-9_.\[\]]+)\s/);
        if (match?.[1] && !fieldErrors[match[1]]) fieldErrors[match[1]] = m;
      } else if (m && typeof m === "object") {
        const prop = (m as any).property as string | undefined;
        const constraints = (m as any).constraints;
        if (constraints && typeof constraints === "object") {
          const first = Object.values(constraints)[0] as string | undefined;
          if (prop && first) {
            fieldErrors[prop] = first;
            msgs.push(first);
          }
        }
      }
    }
    const text = msgs.length ? msgs.join(" | ") : pickFirstText(statusText, fallbackMsg) ?? fallbackMsg;
    return { formError: text, fieldErrors };
  }

  if ((obj as any)?.number || (obj as any)?.code) {
    const text =
      pickFirstText((obj as any).message, (obj as any).error, statusText) ?? fallbackMsg;
    return { formError: text, fieldErrors };
  }

  if (obj.message || obj.error || statusText) {
    const text =
      pickFirstText(
        typeof obj.message === "string" ? obj.message : undefined,
        obj.error as string,
        statusText
      ) ?? fallbackMsg;
    return { formError: text, fieldErrors };
  }

  try {
    const text = JSON.stringify(obj);
    return { formError: text || fallbackMsg, fieldErrors };
  } catch {
    return { formError: fallbackMsg, fieldErrors };
  }
}
